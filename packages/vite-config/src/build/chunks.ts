/**
 * Decides which chunk each module of an application bundle lands in.
 */

import { type UserConfig } from "vite";

import { override, type Override } from "@stealthscale/vite-config-core";

/**
 * Matches the rendering runtime, wherever the package manager happened to put it.
 *
 * @remarks
 *   The pattern looks for a `node_modules` segment rather than a prefix, because pnpm stores a
 *   package under `.pnpm` and links it back in. Matching a prefix would miss every one of them.
 */
const FRAMEWORK = /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/u;

/**
 * Matches everything else that came from the registry.
 */
const VENDOR = /[\\/]node_modules[\\/]/u;

/**
 * Matches the house's own packages: the components, the foundations, the themes and the tooling
 * a page runs, whether they were installed from the registry under the house scope or resolved
 * to their source beside the application in the workspace.
 *
 * @remarks
 *   The workspace directories are named rather than every package outside `node_modules`,
 *   because the application's own source sits outside it too, and the point of the group is to
 *   keep the two apart.
 */
const LIBRARY =
  /[\\/](?:node_modules[\\/]@stealthscale|components|foundations|packages|themes)[\\/]/u;

/**
 * The command a build composes its configuration under.
 */
const BUILDING = "build";

/**
 * The bundler's output options, as the build states them.
 */
type Output = Exclude<
  NonNullable<NonNullable<NonNullable<UserConfig["build"]>["rolldownOptions"]>["output"]>,
  readonly unknown[]
>;

/**
 * The split's options, as the bundler takes them, which the output also takes as a plain switch.
 */
type Splitting = Exclude<NonNullable<Output["codeSplitting"]>, boolean>;

/**
 * One group of the split, as the bundler takes it.
 */
type Group = NonNullable<Splitting["groups"]>[number];

/**
 * Matches what the house and the registry supply alike: the library's packages wherever they
 * were resolved from, and everything under `node_modules`.
 */
const SUPPLIED = /[\\/](?:node_modules|components|foundations|packages|themes)[\\/]/u;

/**
 * The library's group, which a build alone carries.
 */
const LIBRARIED: Group = { name: "library", priority: 8, tags: ["$initial"], test: LIBRARY };

/**
 * The group of what several lazily loaded routes reach and the entry does not, which a build alone
 * carries.
 *
 * @remarks
 *   The bundler places a module the entry does not reach with the route that reaches it, and gives
 *   a module several routes reach a chunk per set of routes: the docs build wrote a chunk of a
 *   tenth of a kilobyte for one such module. Here every such module lands in one chunk, fetched by
 *   the first route that needs it and cached for the rest. The share count the bundler filters on
 *   counts every entry that reaches the module, a route's dynamic import as much as the page's
 *   own, so a module the entry reaches is counted too, and the initial groups claim it first by
 *   their priority. What one route alone reaches stays with that route, and the application's own
 *   modules are left to the bundler, as the initial groups leave them.
 */
const SHARED: Group = { minShareCount: 2, name: "shared", priority: 3, test: SUPPLIED };

/**
 * Lists the groups, with the library's where the command is a build.
 *
 * @remarks
 *   A dev server that bundles groups its chunks the way a build does, and its React refresh
 *   runtime and the preamble that installs it are modules of the application's chunk. A library
 *   chunk runs before that chunk, so every component in it called a runtime not yet set up and the
 *   page stayed white. The library's chunk is a caching measure for a deploy, and a dev server
 *   deploys nothing, so it is left out there, and so is the shared chunk, which an initial module
 *   would join there for the same lack of a library group. No group claims the application's own
 *   modules: a group with no test claimed every module the patterns left, whichever entry reached
 *   it, so two pages ran each other's bootstrap. The bundler keeps a module with the entry that
 *   reaches it where nothing claims it.
 */
function grouped(command: string): readonly Group[] {
  return [
    { name: "framework", priority: 10, tags: ["$initial"], test: FRAMEWORK },
    ...(command === BUILDING ? [LIBRARIED, SHARED] : []),
    { name: "vendor", priority: 5, tags: ["$initial"], test: VENDOR },
  ];
}

/**
 * Writes the split into a configuration, over whatever output the build already stated, keeping
 * every group a plugin contributed ahead of these.
 *
 * @remarks
 *   An output stated as several is left alone, because a split written into every one of them
 *   would be a guess at which one is the page's. A group already in the configuration is kept
 *   first, because a plugin that names the chunk a module lands in knows more about that module
 *   than a path pattern does, and the groups here claim only what an entry reaches statically.
 */
function split(config: UserConfig, groups: readonly Group[]): UserConfig {
  const output = config.build?.rolldownOptions?.output;

  if (Array.isArray(output)) return config;

  const held: Output = output ?? {};
  const splitting = typeof held.codeSplitting === "object" ? held.codeSplitting : {};
  const codeSplitting: Splitting = {
    groups: [...(splitting.groups ?? []), ...groups],
    includeDependenciesRecursively: false,
  };

  return {
    ...config,
    build: {
      ...config.build,
      rolldownOptions: { ...config.build?.rolldownOptions, output: { ...held, codeSplitting } },
    },
  };
}

/**
 * Splits a bundle four ways beside the application: the rendering runtime, the rest of the
 * dependencies, the house's own packages, and what several routes reach beyond the entry. A dev
 * server splits it two ways, without the library and the shared chunk.
 *
 * @remarks
 *   Priority decides which group claims a module, not the order the groups are written in, so the
 *   framework pattern is consulted before the library pattern, and the library pattern before the
 *   vendor pattern that also matches a house package installed from the registry. A module is
 *   placed by its own path alone: the bundler would otherwise pull everything a matched module
 *   imports into the same group, and the library's dependencies would follow it out of the
 *   vendor chunk. Only what an entry reaches statically goes into those three, which leaves a
 *   route that is never visited undownloaded. What several routes reach and the entry does not
 *   lands in the shared chunk, fetched once, rather than in the chunk of whichever route the
 *   bundler met first with every other route importing that one, and what one route alone reaches
 *   stays with it. The application's own modules are claimed by no group, so each entry keeps the
 *   modules it reaches and two pages of one build run their own bootstrap and not each other's.
 *   The library is a chunk of its own because it changes at another pace than the application
 *   drawn with it: a deploy that touched a page alone leaves the library chunk's name, and the
 *   browser's copy of it, as they were. An override rather than a preset, because only an override
 *   is handed the command.
 */
export function chunks(): Override {
  return override({
    because:
      "a chunk per pace of change keeps the browser's copy of the runtime, the dependencies and " +
      "the library across a deploy that touched the application alone",
    name: "build.chunks",
    refine: (context, config) => split(config, grouped(context.command)),
  });
}
