/**
 * Assembles the stylesheet compiler for an application: the statement, every contributor's preset,
 * the rendered configuration, the started compiler and the scanned sources.
 *
 * @remarks
 *   The scan happens once, when the compiler starts. A changed file is handed to the running
 *   compiler one at a time afterwards, which is the incremental path the compiler offers.
 */

import { join, resolve } from "node:path";
import { type ViteDevServer } from "vite";

import {
  dependencies,
  importer,
  type Loading,
  resolvedOnGraph,
  withLock,
  writeIfChanged,
} from "@stealthscale/vite-plugin-base";

import { type Compiler, startCompiler } from "#compiler.ts";
import {
  type Contributor,
  contributors,
  installedSources,
  workspaceRoots,
  workspaceSources,
} from "#contributors.ts";
import { LOCK, type Resolved, scratchDir } from "#options.ts";
import { type Diagnostic } from "#pandacss.ts";
import {
  fontPackages,
  loadPreset,
  loadStatement,
  type Published,
  type Statement,
} from "#statement.ts";
import { distinct, findings } from "#theme/findings.ts";
import { renderedConfig } from "#theme/rendering.ts";

/**
 * File the rendered configuration is written to, under the application's scratch.
 */
const CONFIG = "stylesheet.config.mjs";

/**
 * File a package declares its dependencies in.
 */
const MANIFEST = "package.json";

/**
 * Everything one assembly produced.
 */
export interface Assembled {
  /**
   * Compiler the assembly started.
   */
  compiler: Compiler;

  /**
   * Every package contributing a preset, the system package first.
   */
  contributors: readonly Contributor[];

  /**
   * Findings of the assembly: a name two installations share, a compound no published recipe
   * declares, and an import that renames a component.
   */
  diagnostics: readonly Diagnostic[];

  /**
   * File each font package the themes named resolved to, or undefined where nothing on the graph
   * resolved it.
   */
  fonts: ReadonlyMap<string, string | undefined>;

  /**
   * Source directory of every workspace package the compiler scans, absolute.
   *
   * @remarks
   *   A dev server watches its own root and the files it is handed. A file added to a workspace
   *   package outside the application is neither, so these directories are handed to the watcher.
   */
  roots: readonly string[];

  /**
   * Every file the compiler scanned, absolute, which is what the bundler is asked to watch.
   */
  sources: readonly string[];

  /**
   * Every file the configuration was built from: the statement, the presets and the manifests.
   */
  watched: readonly string[];
}

/**
 * Statement and presets one importer loaded.
 */
interface Loaded {
  /**
   * Every contributor's preset, in the contributors' order.
   */
  presets: readonly Published[];

  /**
   * Application's own statement.
   */
  statement: Statement;
}

/**
 * Loads the statement and every contributor's preset through one importer.
 *
 * @remarks
 *   One importer for the batch, because opening one without a server resolves a configuration and
 *   starts a module runner, and a build has no server to lend one.
 */
async function loaded(
  loading: Loading,
  found: readonly Contributor[],
  server?: ViteDevServer,
): Promise<Loaded> {
  const through = await importer(loading, server);

  try {
    const statement = await loadStatement(loading.root, through);
    const presets = await Promise.all(found.map((each) => loadPreset(each.name, through)));

    return { presets, statement };
  } finally {
    await through.close();
  }
}

/**
 * Returns the globs the compiler scans: the application's own, the source of every workspace
 * package on the graph, and the published JavaScript of every installed contributor.
 */
function scanned(
  root: string,
  graph: ReturnType<typeof dependencies>,
  found: readonly Contributor[],
  resolved: Resolved,
): readonly string[] {
  return [
    ...new Set([
      ...resolved.include,
      ...workspaceSources(root, graph),
      ...installedSources(
        root,
        found.filter((each) => each.name !== resolved.systemPackage),
      ),
    ]),
  ];
}

/**
 * Loads the statement and every contributor's preset, renders the configuration, starts the
 * compiler and scans every package the application depends on.
 *
 * @remarks
 *   An application that states no theme compiles the foundation alone. Every manifest the
 *   dependency walk read is watched along with the statement and the presets, because nothing
 *   watches the files of a package until a manifest names it. The configuration is rendered and
 *   the compiler started under the application's lock, so a second process in the same checkout
 *   reads a configuration this one has finished writing.
 * @throws {@link Error} When the application does not depend on the system package, or the
 *   statement or a preset cannot be loaded.
 */
export async function assemble(
  loading: Loading,
  resolved: Resolved,
  server?: ViteDevServer,
): Promise<Assembled> {
  const { root } = loading;
  const graph = dependencies(root);
  const { diagnostics, kept: found } = distinct(contributors(graph, resolved.systemPackage));
  const { presets, statement } = await loaded(loading, found, server);
  const [foundation, ...rest] = presets;

  if (found[0]?.name !== resolved.systemPackage || foundation === undefined) {
    throw new Error(`${root} does not depend on ${resolved.systemPackage}`);
  }

  const { application } = statement;
  const configPath = join(scratchDir(root), CONFIG);
  const published = [...rest.map((each) => each.preset), ...(application.presets ?? [])];
  const include = scanned(root, graph, found, resolved);
  const compiler = await withLock(join(scratchDir(root), LOCK), () => {
    writeIfChanged(
      configPath,
      renderedConfig({ application, foundation: foundation.preset, include, published, resolved }),
    );

    return startCompiler(root, configPath);
  });
  const sources = compiler.driver.parseFiles().map((report) => resolve(root, report.path));

  return {
    compiler,
    contributors: found,
    diagnostics: [
      ...diagnostics,
      ...findings({
        found,
        loaded: presets.map((each) => each.preset),
        published: [foundation.preset, ...published],
        root,
        sources,
        themes: application.themes ?? [],
      }),
    ],
    fonts: new Map(
      fontPackages(application).map((name) => [name, resolvedOnGraph(root, name, graph)]),
    ),
    roots: workspaceRoots(graph),
    sources,
    watched: [
      ...new Set([
        ...statement.files,
        ...presets.flatMap((each) => each.files),
        join(root, MANIFEST),
        ...graph.map((each) => join(each.at, MANIFEST)),
        ...compiler.dependencies,
      ]),
    ],
  };
}
