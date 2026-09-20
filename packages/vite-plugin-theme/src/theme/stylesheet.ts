/**
 * Compiles the application's stylesheet, and recompiles it when anything behind it changes.
 *
 * @remarks
 *   An application is the only package that can compile a stylesheet, because it is the only one
 *   that knows both the components on the page and the themes they are drawn in. What it writes by
 *   hand is one file naming its themes; everything else is derived from its dependencies.
 */

import { extname } from "node:path";
import {
  type DevEnvironment,
  type Environment,
  type EnvironmentModuleNode,
  type Plugin,
  type ViteDevServer,
} from "vite";

import { type Loading } from "@stealthscale/vite-plugin-base";

import { rewritten } from "#compiler.ts";
import { reportDiagnostics } from "#diagnostics.ts";
import { renderStylesheet } from "#fonts.ts";
import { layerPattern, type Options, type Resolved, resolveOptions } from "#options.ts";
import { type SourceChange } from "#pandacss.ts";
import { assemble, type Assembled } from "#theme/assembly.ts";

/**
 * Fixes what the stylesheet is resolved to.
 *
 * @remarks
 *   A module rather than a file. The stylesheet is generated, and a generated file inside an
 *   application would have to be committed or served out of `node_modules`.
 */
const VIRTUAL = "virtual:stealth-theme.css";

/**
 * The kinds of change a bundler reports about a file, which a dev server's hot update and a build's
 * watch report under the same names.
 */
type Event = "create" | "delete" | "update";

/**
 * Maps a bundler's change event to the change the compiler applies.
 */
const KINDS: Readonly<Record<Event, SourceChange["kind"]>> = {
  create: "add",
  delete: "unlink",
  update: "change",
};

/**
 * Carries the rules compiled from one generation of the compiler.
 */
interface Compiled {
  /**
   * The compiled rules, with what names the compiler removed.
   */
  css: string;

  /**
   * The generation of the compiler the rules were compiled from.
   */
  generation: number;
}

/**
 * Records what the last change reported to the dev server did.
 *
 * @remarks
 *   A server reports one change once per environment, and an editor saving a file reports it
 *   twice, so the change is applied on the first report and the others read the answer.
 */
interface Applied {
  /**
   * The file the change was reported for.
   */
  file: string;

  /**
   * Whether the rules the stylesheets hold went stale: the compiler changed, and compiles to
   * other rules than the ones served.
   */
  stale: boolean;

  /**
   * When the server reported the change, or nothing where the server reports no time.
   */
  timestamp: number | undefined;
}

/**
 * Carries everything the plugin holds between its hooks.
 */
interface Running {
  /**
   * The last change the dev server reported and what applying it did, once one was reported.
   */
  applied?: Applied | undefined;

  /**
   * The compiler and what it was assembled from, once assembled.
   */
  assembled?: Assembled | undefined;

  /**
   * The assembly under way or done, once one was started.
   */
  assembling?: Promise<Assembled> | undefined;

  /**
   * The rules compiled from the current generation, once a stylesheet asked for them.
   */
  compiled?: Compiled | undefined;

  /**
   * Counts the assemblies and the changes applied to the compiler, so rules compiled before a
   * change are not served after it.
   */
  generation: number;

  /**
   * Where the application is, and the conditions it resolves under.
   */
  loading: Loading;

  /**
   * The dev server, where one is running.
   */
  server?: undefined | ViteDevServer;

  /**
   * Every stylesheet the compiled rules were appended to.
   */
  sheets: Set<string>;
}

/**
 * Reads an identifier without whatever a request appended to it.
 */
function bare(id: string): string {
  return id.replace(/\?.*$/su, "");
}

/**
 * Assembles the compiler, and forgets the attempt where it failed, so the next request tries
 * again rather than reporting the same failure for the life of the process.
 *
 * @remarks
 *   An assembly is a new generation, so rules compiled from the one before are compiled again.
 *   Under a dev server the source directory of every workspace package the compiler scans is
 *   handed to the watcher, because the server watches its own root alone and a file added to a
 *   package beside the application would otherwise reach the compiler only when it restarts.
 */
async function assembling(state: Running, resolved: Resolved): Promise<Assembled> {
  try {
    const assembled = await assemble(state.loading, resolved, state.server);

    state.assembled = assembled;
    state.generation += 1;
    state.server?.watcher.add([...assembled.roots]);

    return assembled;
  } catch (error: unknown) {
    state.assembling = undefined;

    throw error;
  }
}

/**
 * Starts the assembly once, and returns the same one until something drops it.
 *
 * @remarks
 *   The assembly is a promise rather than a value, so a dev server starts it without waiting and
 *   the first request for the stylesheet waits instead, beside every other request the server
 *   answers meanwhile.
 */
function ready(state: Running, resolved: Resolved): Promise<Assembled> {
  state.assembling ??= assembling(state, resolved);

  return state.assembling;
}

/**
 * Drops the assembly, so the next request assembles the compiler again.
 */
function dropped(state: Running): void {
  state.assembled = undefined;
  state.assembling = undefined;
}

/**
 * Lists what each face the themes named is imported as: its file, or its name where nothing
 * resolved it.
 */
function faces(assembled: Assembled): readonly string[] {
  return [...assembled.fonts].map(([name, file]) => file ?? name);
}

/**
 * Invalidates the stylesheets the compiled rules were appended to, so the next request
 * retransforms them.
 *
 * @remarks
 *   A stylesheet the graph no longer holds is forgotten, so a sheet renamed while the server runs
 *   is not looked up on every change for the life of the process.
 */
function invalidated(environment: DevEnvironment, sheets: Set<string>): EnvironmentModuleNode[] {
  const found: EnvironmentModuleNode[] = [];

  for (const id of sheets) {
    const module = environment.moduleGraph.getModuleById(id);

    if (module === undefined) {
      sheets.delete(id);
    } else {
      environment.moduleGraph.invalidateModule(module);
      found.push(module);
    }
  }

  return found;
}

/**
 * The part of a transform's context the compile reads: the watch list and the warning channel.
 */
interface Transforming {
  /**
   * Adds a file whose change retransforms the module.
   */
  addWatchFile: (file: string) => void;

  /**
   * Puts a message in front of the person running the build.
   */
  warn: (message: string) => void;
}

/**
 * Compiles the rules once per generation, renames every class selector into the scheme, reports
 * what the compiler and the rename found, and returns the rules.
 *
 * @remarks
 *   Every stylesheet that declares the cascade order receives the same rules, so the compile and
 *   the rename run once for a generation however many stylesheets ask, and the diagnostics are
 *   reported once with them. An application whose graph names no package publishing a preset
 *   beside the system package compiles a stylesheet carrying the foundation's values and no
 *   component's rules, which is a blank-looking page and a build that succeeded, so that is
 *   reported here too.
 */
function compiled(state: Running, assembled: Assembled, warn: Transforming["warn"]): string {
  if (state.compiled?.generation === state.generation) return state.compiled.css;

  const { compiler, contributors } = assembled;
  const output = compiler.driver.cssgen({ emitLayerDeclaration: false });
  const renamed = rewritten(compiler, output.css);

  reportDiagnostics(compiler.driver.designSystemDiagnostics, "the design system", warn);
  reportDiagnostics(output.diagnostics, "the stylesheet", warn);
  reportDiagnostics(renamed.diagnostics, "the class names", warn);

  if (contributors.length === 1) {
    warn(
      "No package on this application's dependency graph publishes a preset under ./theme " +
        "beside the system package, so the stylesheet carries the foundation's values and no " +
        "component's rules.",
    );
  }

  state.compiled = { css: renamed.css, generation: state.generation };

  return state.compiled.css;
}

/**
 * Appends the compiled rules to a stylesheet, and asks the bundler to watch everything behind them.
 */
function appended(
  state: Running,
  assembled: Assembled,
  context: Transforming,
  code: string,
): string {
  for (const file of [...assembled.watched, ...assembled.sources]) context.addWatchFile(file);

  return `${code}\n${compiled(state, assembled, context.warn.bind(context))}`;
}

/**
 * Applies a changed file to the compiler: a file behind the configuration restarts it, a source
 * file is handed to it, and any other file is left alone.
 *
 * @remarks
 *   The compiler reads a changed file from disk itself, so the change carries no content, and a
 *   deleted file is reported as one rather than read. A file outside the compiler's globs is left
 *   alone before the compiler is asked, because the compiler reads a file it is handed before it
 *   decides whether the file is one it scans.
 * @returns The compiler as it stands after the change, or undefined where nothing changed.
 */
function applied(
  state: Running,
  resolved: Resolved,
  file: string,
  event: Event,
): Promise<Assembled | undefined> {
  const assembled = state.assembled;
  const nothing: Assembled | undefined = undefined;

  if (assembled === undefined) return Promise.resolve(nothing);

  if (assembled.watched.includes(file)) {
    dropped(state);

    return ready(state, resolved);
  }

  const { driver } = assembled.compiler;

  if (!driver.isSourceFile(file) || !driver.applyChange({ kind: KINDS[event], path: file })) {
    return Promise.resolve(nothing);
  }

  state.generation += 1;

  return Promise.resolve(assembled);
}

/**
 * Applies a change the dev server reported, once, and says whether the rules served went stale.
 *
 * @remarks
 *   A server reports one change once per environment it runs, and an editor that saves a file by
 *   writing a new one reports it twice more, so a change already applied under the same file and
 *   time answers what the first report found. A server that bundles reports no time, and reports
 *   a change once, so every report it makes is applied. The rules are compiled here rather than
 *   at the next request, so a change that compiles to the rules the stylesheets already hold,
 *   which is most edits to a specimen or a page, invalidates nothing and sends nothing to the
 *   browser.
 * @returns True when the stylesheets hold rules the compiler no longer compiles to.
 */
async function reported(
  state: Running,
  resolved: Resolved,
  change: Pick<Changed, "file" | "timestamp" | "type">,
  warn: Transforming["warn"],
): Promise<boolean> {
  const { file, timestamp, type } = change;
  const last = state.applied;
  const repeated =
    last !== undefined &&
    timestamp !== undefined &&
    last.file === file &&
    last.timestamp === timestamp;

  if (repeated) return last.stale;

  const before = state.compiled?.css;
  const assembled = await applied(state, resolved, file, type);
  const stale = assembled !== undefined && compiled(state, assembled, warn) !== before;

  state.applied = { file, stale, timestamp };

  return stale;
}

/**
 * The part of a hot update the plugin reads.
 */
interface Changed {
  /**
   * The file that changed.
   */
  readonly file: string;

  /**
   * The modules the server resolved for the change.
   */
  readonly modules: EnvironmentModuleNode[];

  /**
   * When the server reported the change, which a server that bundles leaves out.
   */
  readonly timestamp?: number | undefined;

  /**
   * The kind of change.
   */
  readonly type: Event;
}

/**
 * Builds the plugin that compiles the application's stylesheet.
 *
 * @remarks
 *   The plugin runs before Vite's own CSS handling, so the compiled rules are in the stylesheet by
 *   the time Vite processes it. The compiler starts at `buildStart` rather than when the
 *   configuration resolves, because resolving a configuration is also how a workspace plans its
 *   build graph.
 */
export function stylesheet(options: Options = {}): Plugin {
  const resolved = resolveOptions(options);
  const declared = layerPattern(resolved.layers);
  const state: Running = { generation: 0, loading: { root: process.cwd() }, sheets: new Set() };

  return {
    enforce: "pre",
    name: "stealth:theme.stylesheet",

    /**
     * Records where the application is and under which conditions it resolves.
     */
    configResolved(config) {
      state.loading = { conditions: config.ssr.resolve?.conditions, root: config.root };
    },

    /**
     * Keeps the dev server, whose runner the statement and the presets are loaded through.
     */
    configureServer(server) {
      state.server = server;
    },

    /**
     * Starts the compiler before anything is served or bundled.
     *
     * @remarks
     *   A build waits for it, because everything it bundles reads the compiled rules. A dev
     *   server does not, so it answers its first request seconds sooner: the stylesheet waits
     *   for the compiler when it is asked for, beside the modules the server transforms
     *   meanwhile, and a failure is reported there rather than left unhandled here.
     */
    async buildStart() {
      const environment: Environment | undefined = this.environment;
      const started = ready(state, resolved);

      if (environment?.config.command === "build") await started;
      else void Promise.allSettled([started]);
    },

    /**
     * Answers the stylesheet an application imports, and every font package its themes named.
     */
    resolveId(id) {
      const held = bare(id);

      if (held === resolved.stylesheet || held === VIRTUAL) return id.replace(held, VIRTUAL);

      return state.assembled?.fonts.get(held) ?? null;
    },

    /**
     * Renders the stylesheet: the faces the themes named, then the cascade order.
     *
     * @remarks
     *   The faces are the compiler's to name, so the stylesheet waits for the assembly, and
     *   starts one where a server was asked for the stylesheet before it started the compiler.
     */
    async load(id) {
      if (bare(id) !== VIRTUAL) return null;

      return renderStylesheet(resolved.layers, faces(await ready(state, resolved)));
    },

    /**
     * Appends the compiled rules to a stylesheet that declares the cascade order.
     */
    async transform(code, id) {
      if (extname(bare(id)) !== ".css" || !declared.test(code)) return null;

      state.sheets.add(id);

      return { code: appended(state, await ready(state, resolved), this, code), map: null };
    },

    /**
     * Applies a change where no hot update runs: under a build that watches, and under a server
     * that bundles.
     *
     * @remarks
     *   A server that serves one module per file reports the same change to `hotUpdate`, which
     *   applies it and invalidates the stylesheets, so under that server this hook leaves the
     *   change to that one. A server that bundles runs no hot update hook and reports the change
     *   here, once per environment, so the bundled environment applies it before the bundler
     *   compiles the stylesheet again, which watches every file behind it through the transform.
     *   The presets are imported through the server's `ssr` runner, and the server invalidates
     *   that runner's graph only once every watch change has returned, so the file is invalidated
     *   here first: the assembly that follows would otherwise import the module the runner
     *   evaluated before the change, and compile the rules the stylesheet already holds.
     */
    async watchChange(id, change) {
      const environment: Environment | undefined = this.environment;

      if (environment?.config.command !== "build" && !environment?.config.isBundled) return;

      state.server?.environments["ssr"]?.moduleGraph.onFileChange(id);
      await applied(state, resolved, id, change.event);
    },

    /**
     * Applies a change under a dev server, once however many times the server reports it, and
     * invalidates every stylesheet the rules were appended to when the rules went stale.
     */
    async hotUpdate(context) {
      const stale = await reported(state, resolved, context, this.warn.bind(this));
      const environment: DevEnvironment | undefined = this.environment;

      if (!stale || environment === undefined) return context.modules;

      return [...new Set([...invalidated(environment, state.sheets), ...context.modules])];
    },
  };
}
