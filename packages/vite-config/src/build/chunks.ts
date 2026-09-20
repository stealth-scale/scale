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
 * The library's group, which a build alone carries.
 */
const LIBRARIED: Group = { name: "library", priority: 8, tags: ["$initial"], test: LIBRARY };

/**
 * Lists the groups, with the library's where the command is a build.
 *
 * @remarks
 *   A dev server that bundles groups its chunks the way a build does, and its React refresh
 *   runtime and the preamble that installs it are modules of the application's chunk. A library
 *   chunk runs before that chunk, so every component in it called a runtime not yet set up and the
 *   page stayed white. The library's chunk is a caching measure for a deploy, and a dev server
 *   deploys nothing, so it is left out there.
 */
function grouped(command: string): readonly Group[] {
  return [
    { name: "framework", priority: 10, tags: ["$initial"], test: FRAMEWORK },
    ...(command === BUILDING ? [LIBRARIED] : []),
    { name: "vendor", priority: 5, tags: ["$initial"], test: VENDOR },
    { name: "app", tags: ["$initial"] },
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
 * Splits a bundle four ways: the rendering runtime, the rest of the dependencies, the house's own
 * packages, the application. A dev server splits it three ways, without the library.
 *
 * @remarks
 *   Priority decides which group claims a module, not the order the groups are written in, so the
 *   framework pattern is consulted before the library pattern, and the library pattern before the
 *   vendor pattern that also matches a house package installed from the registry. A module is
 *   placed by its own path alone: the bundler would otherwise pull everything a matched module
 *   imports into the same group, and the library's dependencies would follow it out of the
 *   vendor chunk. Only what an entry reaches statically is grouped, which leaves a lazily
 *   imported module in a chunk of its own and a route that is never visited undownloaded. The
 *   library is a chunk of its own because it changes at another pace than the application drawn
 *   with it: a deploy that touched a page alone leaves the library chunk's name, and the
 *   browser's copy of it, as they were. An override rather than a preset, because only an
 *   override is handed the command.
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
