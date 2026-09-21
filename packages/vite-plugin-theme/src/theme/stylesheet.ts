/**
 * Compiles the application's stylesheet and recompiles it when any of its inputs change.
 *
 * @remarks
 *   Only an application can compile a stylesheet, because only an application knows both the
 *   components that reach the page and the themes they are styled in. It hand-writes one file
 *   naming its themes; everything else is derived from its dependency graph.
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
import { hasErrors, reportDiagnostics } from "#diagnostics.ts";
import { renderStylesheet } from "#fonts.ts";
import { layerPattern, type Options, type Resolved, resolveOptions } from "#options.ts";
import { type Diagnostic, type SourceChange } from "#pandacss.ts";
import { assemble, type Assembled } from "#theme/assembly.ts";

/**
 * The virtual module id the stylesheet resolves to.
 *
 * @remarks
 *   The stylesheet is generated, so it has to be a module rather than a file. Writing a real file
 *   inside the application would mean committing it or serving it out of `node_modules`.
 */
const VIRTUAL = "virtual:stealth-theme.css";

/**
 * The environment name to fall back on when the bundler binds none, as happens under a
 * specification.
 */
const CLIENT = "client";

/**
 * The change kinds a bundler reports for a file. A dev server's hot update and a build's watch use
 * the same names.
 */
type Event = "create" | "delete" | "update";

/**
 * The compiler's change kind for each of the bundler's events.
 */
const KINDS: Readonly<Record<Event, SourceChange["kind"]>> = {
  create: "add",
  delete: "unlink",
  update: "change",
};

/**
 * The rules compiled from one generation of the compiler.
 */
interface Compiled {
  /**
   * The compiled rules, with every class selector renamed into the scheme.
   */
  css: string;

  /**
   * The generation the rules were compiled from.
   */
  generation: number;
}

/**
 * The last change the dev server reported, and what applying it did.
 *
 * @remarks
 *   A server reports one change once per environment, and an editor that saves by writing a new
 *   file reports it twice more, so the first report applies the change and the rest read this back.
 */
interface Applied {
  /**
   * The file the change was reported for.
   */
  file: string;

  /**
   * Whether the compiler now compiles to rules other than the ones the stylesheets hold.
   */
  stale: boolean;

  /**
   * When the server reported the change, or undefined from a server that reports no time.
   */
  timestamp: number | undefined;
}

/**
 * The plugin's state, held across its hooks.
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
   * The assembly in flight or already resolved, once one was started.
   */
  assembling?: Promise<Assembled> | undefined;

  /**
   * The rules compiled from the current generation, once a stylesheet asked for them.
   */
  compiled?: Compiled | undefined;

  /**
   * A counter bumped by each assembly and each change applied to the compiler, so rules compiled
   * before a change are never served after it.
   */
  generation: number;

  /**
   * Where the application is and the conditions it resolves under.
   */
  loading: Loading;

  /**
   * Changes reported while no compiler could take them, keyed by file, for the next compiler.
   */
  pending: Map<string, Event>;

  /**
   * The dev server, when one is running.
   */
  server?: undefined | ViteDevServer;

  /**
   * The stylesheets the compiled rules were appended to, keyed by the environment that asked.
   */
  sheets: Map<string, Set<string>>;
}

/**
 * The one field of an environment the plugin reads to tell environments apart.
 */
interface Named {
  /**
   * The environment's name. A bundler binds it; a specification may not.
   */
  name?: string | undefined;
}

/**
 * Strips the query string a request appended to a module id.
 */
function bare(id: string): string {
  return id.replace(/\?.*$/su, "");
}

/**
 * Returns the set of stylesheets one environment appended the rules to, creating it on first use.
 */
function sheetsOf(state: Running, environment: Named | undefined): Set<string> {
  const name = environment?.name ?? CLIENT;
  const held = state.sheets.get(name) ?? new Set<string>();

  state.sheets.set(name, held);

  return held;
}

/**
 * Passes one changed file to a compiler and reports whether the compiler took it.
 *
 * @remarks
 *   The compiler reads the file from disk itself, so the change carries no content and a deleted
 *   file is reported rather than read. Files outside the compiler's globs are filtered out first,
 *   because the compiler reads whatever it is handed before deciding whether to scan it.
 */
function handed(assembled: Assembled, file: string, event: Event): boolean {
  const { driver } = assembled.compiler;

  return driver.isSourceFile(file) && driver.applyChange({ kind: KINDS[event], path: file });
}

/**
 * Applies the changes that landed during an assembly to the compiler that assembly produced.
 *
 * @remarks
 *   A change to a file the configuration was built from makes the assembly stale before it is ever
 *   served, so the assembly is rerun rather than handed a change it cannot take. The queue is
 *   drained only after the assembly resolves, so a change reported at any point during it reaches
 *   either this compiler or the next.
 */
function drained(state: Running, resolved: Resolved, held: Assembled): Promise<Assembled> {
  const pending = [...state.pending];

  state.pending.clear();

  if (pending.some(([file]) => held.watched.includes(file))) return settled(state, resolved);

  for (const [file, event] of pending) handed(held, file, event);

  return Promise.resolve(held);
}

/**
 * Assembles the compiler, then drains whatever was reported while it was assembling.
 */
async function settled(state: Running, resolved: Resolved): Promise<Assembled> {
  return drained(state, resolved, await assemble(state.loading, resolved, state.server));
}

/**
 * Assembles the compiler and clears the cached attempt on failure, so the next request retries
 * instead of replaying the same error for the life of the process.
 *
 * @remarks
 *   Each assembly bumps the generation, so rules compiled against the previous one are recompiled.
 *   Under a dev server the source directory of every workspace package the compiler scans is added
 *   to the watcher, because the server watches only its own root; without this, a file added to a
 *   workspace package outside the application would reach the compiler only after a restart.
 */
async function assembling(state: Running, resolved: Resolved): Promise<Assembled> {
  try {
    const assembled = await settled(state, resolved);

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
 * Starts the assembly once and hands back the same promise until something drops it.
 *
 * @remarks
 *   Caching the promise rather than the value lets a dev server kick the assembly off without
 *   blocking: the first request for the stylesheet does the waiting, and the server answers
 *   everything else meanwhile.
 */
function ready(state: Running, resolved: Resolved): Promise<Assembled> {
  state.assembling ??= assembling(state, resolved);

  return state.assembling;
}

/**
 * Discards the assembly, so the next request assembles the compiler from scratch.
 */
function dropped(state: Running): void {
  state.assembled = undefined;
  state.assembling = undefined;
}

/**
 * Returns the import specifier for each font package the themes named: the resolved file, or the
 * bare package name when nothing resolved it.
 */
function faces(assembled: Assembled): readonly string[] {
  return [...assembled.fonts].map(([name, file]) => file ?? name);
}

/**
 * Invalidates the stylesheets the compiled rules were appended to, so the next request
 * retransforms them.
 *
 * @remarks
 *   A stylesheet the module graph no longer holds is dropped from the set, so a sheet renamed
 *   mid-session is not looked up on every change for the life of the process. The graph and the
 *   set both belong to one environment, so a sheet another environment holds is untouched.
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
 * The part of a hook's context the compile reads: whether a build is running, and where to warn.
 */
interface Reporting {
  /**
   * Whether the rules are compiled for a build, which fails on an error, rather than for a
   * server, which keeps serving the rules it compiled before the error.
   */
  building: boolean;

  /**
   * Puts a message in front of the person running the build.
   */
  warn: (message: string) => void;
}

/**
 * The part of an environment's configuration the compile reads.
 */
interface Commanded {
  /**
   * The command the environment runs under.
   */
  command: string;
}

/**
 * The part of an environment the compile reads.
 */
interface Environmental {
  /**
   * The environment's configuration.
   */
  config: Commanded;
}

/**
 * The part of a transform hook's context this file uses.
 */
interface Transforming {
  /**
   * Registers a file whose change retransforms the module.
   */
  addWatchFile: (file: string) => void;

  /**
   * The environment the hook is bound to, when the bundler binds one.
   */
  environment?: Environmental | undefined;

  /**
   * Puts a message in front of the person running the build.
   */
  warn: (message: string) => void;
}

/**
 * The diagnostics one stage of the compile produced.
 */
interface Diagnosed {
  /**
   * The diagnostics the stage produced.
   */
  diagnostics: readonly Diagnostic[];
}

/**
 * Narrows a transform's context down to the reporting the compile needs.
 */
function reporting(context: Transforming): Reporting {
  return {
    building: context.environment?.config.command === "build",
    warn: context.warn.bind(context),
  };
}

/**
 * Warns about every diagnostic one compile produced, and returns them all for an error check.
 *
 * @remarks
 *   The system package is always a contributor, so a contributor list of length one means no
 *   dependency published a preset and the stylesheet carries no component rules. That is almost
 *   always a misconfigured dependency graph rather than an intentionally empty application, so it
 *   gets its own warning.
 */
function reported(
  assembled: Assembled,
  output: Diagnosed,
  renamed: Diagnosed,
  warn: Reporting["warn"],
): readonly Diagnostic[] {
  const { compiler, contributors } = assembled;

  reportDiagnostics(compiler.driver.designSystemDiagnostics, "the design system", warn);
  reportDiagnostics(output.diagnostics, "the stylesheet", warn);
  reportDiagnostics(renamed.diagnostics, "the class names", warn);
  reportDiagnostics(assembled.diagnostics, "the contributors", warn);

  if (contributors.length === 1) {
    warn(
      "No package on this application's dependency graph publishes a preset under ./theme " +
        "beside the system package, so the stylesheet carries the foundation's values and no " +
        "component's rules.",
    );
  }

  return [
    ...compiler.driver.designSystemDiagnostics,
    ...output.diagnostics,
    ...renamed.diagnostics,
    ...assembled.diagnostics,
  ];
}

/**
 * Compiles the rules, renames every class selector into the scheme, warns about what the compiler
 * and the rename found, and returns the rules. Cached per generation.
 *
 * @remarks
 *   Every stylesheet declaring the cascade order gets the same rules, so the compile and the
 *   rename run once per generation no matter how many stylesheets ask. An error is a rule the
 *   compiler could not compile, or a class two names collide on. A build fails on it; a server
 *   warns and keeps serving the rules compiled before it, so the page keeps its styles while
 *   someone fixes the error.
 * @throws {@link Error} Under a build, when the compiler or the rename reported an error.
 */
function compiled(state: Running, assembled: Assembled, context: Reporting): string {
  if (state.compiled?.generation === state.generation) return state.compiled.css;

  const output = assembled.compiler.driver.cssgen({ emitLayerDeclaration: false });
  const renamed = rewritten(assembled.compiler, output.css);
  const failed = hasErrors(reported(assembled, output, renamed, context.warn));

  if (failed && context.building) {
    throw new Error("the stylesheet did not compile: the errors reported above stop the build");
  }

  const kept = failed ? state.compiled : undefined;

  if (kept !== undefined) {
    context.warn("the stylesheet keeps the rules compiled before the errors reported above");
  }

  state.compiled = { css: kept?.css ?? renamed.css, generation: state.generation };

  return state.compiled.css;
}

/**
 * Appends the compiled rules to a stylesheet and registers every file behind them as a watch
 * dependency.
 */
function appended(
  state: Running,
  assembled: Assembled,
  context: Transforming,
  code: string,
): string {
  for (const file of [...assembled.watched, ...assembled.sources]) context.addWatchFile(file);

  return `${code}\n${compiled(state, assembled, reporting(context))}`;
}

/**
 * Applies a changed file to the compiler: a file behind the configuration forces a reassembly, a
 * source file is handed to the compiler, anything else is ignored.
 *
 * @remarks
 *   When there is no compiler to take the change, because the assembly is in flight or failed, the
 *   change is queued for the compiler the next assembly produces, and this starts that assembly if
 *   none is running. Nothing is dropped, so the rules served afterwards match what is on disk.
 * @returns The compiler as it stands after the change, or undefined when nothing changed.
 */
function applied(
  state: Running,
  resolved: Resolved,
  file: string,
  event: Event,
): Promise<Assembled | undefined> {
  const assembled = state.assembled;
  const nothing: Assembled | undefined = undefined;

  if (assembled === undefined) {
    state.pending.set(file, event);

    return ready(state, resolved);
  }

  if (assembled.watched.includes(file)) {
    dropped(state);

    return ready(state, resolved);
  }

  if (!handed(assembled, file, event)) return Promise.resolve(nothing);

  state.generation += 1;

  return Promise.resolve(assembled);
}

/**
 * Applies a change the dev server reported, exactly once, and reports whether the served rules
 * went stale.
 *
 * @remarks
 *   A server reports one change once per environment it runs, and an editor that saves by writing
 *   a new file reports it twice more, so a repeat under the same file and timestamp replays what
 *   the first report found. A server that bundles reports no timestamp and reports each change
 *   once, so every report it makes is applied. The rules are compiled here rather than lazily at
 *   the next request, so a change that compiles to the rules the stylesheets already hold
 *   invalidates nothing and sends nothing to the browser.
 * @returns True when the stylesheets hold rules other than the ones the compiler now produces.
 */
async function changed(
  state: Running,
  resolved: Resolved,
  change: Pick<Changed, "file" | "timestamp" | "type">,
  warn: Reporting["warn"],
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
  const stale =
    assembled !== undefined && compiled(state, assembled, { building: false, warn }) !== before;

  state.applied = { file, stale, timestamp };

  return stale;
}

/**
 * The part of a hot update context the plugin reads.
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
   * When the server reported the change. A server that bundles leaves this out.
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
 *   Enforced `pre`, so the rules are in the stylesheet before Vite's own CSS handling processes
 *   it. The compiler starts at `buildStart` rather than at `configResolved`, because a workspace
 *   also resolves configurations just to plan its build graph, and those runs must not pay for an
 *   assembly.
 */
export function stylesheet(options: Options = {}): Plugin {
  const resolved = resolveOptions(options);
  const declared = layerPattern(resolved.layers);
  const state: Running = {
    generation: 0,
    loading: { root: process.cwd() },
    pending: new Map(),
    sheets: new Map(),
  };

  return {
    enforce: "pre",
    name: "stealth:theme.stylesheet",

    /**
     * Records where the application is and which conditions it resolves under.
     */
    configResolved(config) {
      state.loading = { conditions: config.ssr.resolve?.conditions, root: config.root };
    },

    /**
     * Keeps the dev server, whose module runner loads the theme statement and the presets.
     */
    configureServer(server) {
      state.server = server;
    },

    /**
     * Starts the compiler before anything is served or bundled.
     *
     * @remarks
     *   A build awaits it, because everything it bundles reads the compiled rules. A dev server
     *   does not, so its first request lands sooner: the stylesheet does the waiting when someone
     *   asks for it, while the server transforms other modules. The `allSettled` keeps a failed
     *   assembly from surfacing as an unhandled rejection here; it is reported where it is awaited.
     */
    async buildStart() {
      const environment: Environment | undefined = this.environment;
      const started = ready(state, resolved);

      if (environment?.config.command === "build") await started;
      else void Promise.allSettled([started]);
    },

    /**
     * Resolves the stylesheet the application imports, and every font package its themes named.
     */
    resolveId(id) {
      const held = bare(id);

      if (held === resolved.stylesheet || held === VIRTUAL) return id.replace(held, VIRTUAL);

      return state.assembled?.fonts.get(held) ?? null;
    },

    /**
     * Renders the stylesheet: the font faces the themes named, then the cascade order.
     *
     * @remarks
     *   Only the assembly knows the faces, so this awaits it, and starts one if the server was
     *   asked for the stylesheet before `buildStart` got the compiler going.
     */
    async load(id) {
      if (bare(id) !== VIRTUAL) return null;

      return renderStylesheet(resolved.layers, faces(await ready(state, resolved)));
    },

    /**
     * Appends the compiled rules to any stylesheet that declares the cascade order.
     */
    async transform(code, id) {
      if (extname(bare(id)) !== ".css" || !declared.test(code)) return null;

      sheetsOf(state, this.environment).add(id);

      return { code: appended(state, await ready(state, resolved), this, code), map: null };
    },

    /**
     * Applies a change in the two cases where no hot update runs: a build that watches, and a
     * server that bundles.
     *
     * @remarks
     *   A server that serves one module per file reports the same change to `hotUpdate`, which
     *   applies it and invalidates the stylesheets, so this hook defers to that one and returns
     *   early. A server that bundles runs no `hotUpdate` and reports here instead, once per
     *   environment. The presets are imported through the server's `ssr` runner, and the server
     *   invalidates that runner's graph only after every `watchChange` has returned, so the file
     *   is invalidated here first or the assembly reloads the stale preset.
     */
    async watchChange(id, change) {
      const environment: Environment | undefined = this.environment;

      if (environment?.config.command !== "build" && !environment?.config.isBundled) return;

      state.server?.environments["ssr"]?.moduleGraph.onFileChange(id);
      await applied(state, resolved, id, change.event);
    },

    /**
     * Applies a change under a dev server once, however many times the server reports it, and
     * invalidates the stylesheets the rules were appended to if those rules went stale.
     *
     * @remarks
     *   A stylesheet watches every source the compiler scans, so the server lists it among the
     *   modules affected by any source change. When the change compiles to rules the stylesheet
     *   already holds, the stylesheet is filtered back out of that list and the browser gets the
     *   changed module on its own, with no style update behind it.
     */
    async hotUpdate(context) {
      const stale = await changed(state, resolved, context, this.warn.bind(this));
      const environment: DevEnvironment | undefined = this.environment;

      if (environment === undefined) return context.modules;

      const sheets = sheetsOf(state, environment);

      if (!stale) {
        return context.modules.filter((module) => module.id === null || !sheets.has(module.id));
      }

      return [...new Set([...invalidated(environment, sheets), ...context.modules])];
    },
  };
}
