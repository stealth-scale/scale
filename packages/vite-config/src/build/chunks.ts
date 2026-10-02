/**
 * Assigns each module of an application bundle to a code-splitting group.
 */

import { type UserConfig } from "vite";

import { override, type Override } from "@stealthscale/vite-config-core";

/**
 * Matches a module path under react, react-dom or scheduler.
 *
 * @remarks
 *   The pattern matches a `node_modules` segment anywhere in a path, not a prefix. pnpm installs
 *   a package under `.pnpm` and links it into `node_modules`, so a prefix match misses every
 *   package it installs.
 */
const FRAMEWORK = /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/u;

/**
 * Matches a module path under `node_modules`.
 */
const VENDOR = /[\\/]node_modules[\\/]/u;

/**
 * Matches a module path under an `@stealthscale` package or a workspace source directory.
 *
 * @remarks
 *   The pattern names the five workspace directories and does not match every path outside
 *   `node_modules`. An application's source is outside `node_modules` as well, and this group has
 *   to exclude it.
 */
const LIBRARY =
  /[\\/](?:node_modules[\\/]@stealthscale|components|foundations|packages|sdk|themes)[\\/]/u;

/**
 * Declares the Vite command a production build runs under.
 */
const BUILDING = "build";

/**
 * Resolves to rolldown's output options, excluding the array form.
 */
type Output = Exclude<
  NonNullable<NonNullable<NonNullable<UserConfig["build"]>["rolldownOptions"]>["output"]>,
  readonly unknown[]
>;

/**
 * Resolves to rolldown's `codeSplitting` options, excluding the boolean form the output also takes.
 */
type Splitting = Exclude<NonNullable<Output["codeSplitting"]>, boolean>;

/**
 * Resolves to one entry of rolldown's code-splitting groups.
 */
type Group = NonNullable<Splitting["groups"]>[number];

/**
 * Matches a module path under `node_modules` or a workspace source directory.
 */
const SUPPLIED = /[\\/](?:node_modules|components|foundations|packages|sdk|themes)[\\/]/u;

/**
 * Groups every `@stealthscale` module an entry imports statically into one initial chunk.
 */
const LIBRARIED: Group = { name: "library", priority: 8, tags: ["$initial"], test: LIBRARY };

/**
 * Groups modules that two or more entries import and no initial group claims into one shared
 * chunk.
 *
 * @remarks
 *   The `minShareCount` threshold counts static and dynamic entries alike, so a module the initial
 *   entry imports passes it too, and the three initial groups claim that module first on priority.
 *   Without the group, rolldown emits one chunk per set of routes that share a module, as small as
 *   0.1 kB in the docs build.
 */
const SHARED: Group = { minShareCount: 2, name: "shared", priority: 3, test: SUPPLIED };

/**
 * Returns the code-splitting groups for a command, with the library and shared groups under a
 * build alone.
 *
 * @remarks
 *   A bundling dev server places the React refresh runtime in the application's chunk, and the
 *   library chunk executes before that chunk, so a component in the library calls a runtime that
 *   is not installed and the page renders blank. The library chunk is a caching measure for a
 *   deploy, which a dev server does not perform.
 */
function grouped(command: string): readonly Group[] {
  return [
    { name: "framework", priority: 10, tags: ["$initial"], test: FRAMEWORK },
    ...(command === BUILDING ? [LIBRARIED, SHARED] : []),
    { name: "vendor", priority: 5, tags: ["$initial"], test: VENDOR },
  ];
}

/**
 * Returns the configuration with the groups appended to its code-splitting options.
 *
 * @remarks
 *   A configuration whose output is an array is returned unchanged, because the function cannot
 *   tell which of several outputs belongs to the page. Groups the configuration already states
 *   keep their position ahead of these, so a plugin that assigns a module to a named chunk takes
 *   precedence over a path pattern.
 */
function split(config: UserConfig, groups: readonly Group[]): UserConfig {
  const output = config.build?.rolldownOptions?.output;

  if (Array.isArray(output)) return config;

  const stated: Output = output ?? {};
  const splitting = typeof stated.codeSplitting === "object" ? stated.codeSplitting : {};
  const codeSplitting: Splitting = {
    groups: [...(splitting.groups ?? []), ...groups],
    includeDependenciesRecursively: false,
  };

  return {
    ...config,
    build: {
      ...config.build,
      rolldownOptions: { ...config.build?.rolldownOptions, output: { ...stated, codeSplitting } },
    },
  };
}

/**
 * Returns an override that splits an application bundle into a framework, library, vendor and
 * shared chunk, and into a framework and vendor chunk alone under a dev server.
 *
 * @remarks
 *   Priority orders the patterns, so the vendor pattern is consulted last and does not claim an
 *   `@stealthscale` package installed from the registry. `includeDependenciesRecursively` is false,
 *   which places each module by its path alone and keeps the library's dependencies in the vendor
 *   chunk. No group matches an application module, so each entry keeps the modules it imports and
 *   two pages of one build do not share a bootstrap chunk. Only an override receives the command,
 *   which is why this layer is an override.
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
