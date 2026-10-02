/**
 * Layers a repository adds to depart from the house formatting rules.
 *
 * @remarks
 *   Every layer here appends to the setting a preset already made, rather than replacing it, so a
 *   repository that skips one directory keeps the house list of generated files.
 */

import { type UserConfig } from "vite";

import {
  contribute,
  type Contribution,
  type Override,
  override,
} from "@stealthscale/vite-config-core";

import { GENERATED } from "#ignore/generated.ts";

/**
 * The object form of `fmt.sortImports`, which is the form a contributed group merges into.
 */
type Sorted = Exclude<NonNullable<NonNullable<UserConfig["fmt"]>["sortImports"]>, boolean>;

/**
 * Configuration path of the list of globs the formatter skips.
 */
const SKIPPED = "fmt.ignorePatterns";

/**
 * Configuration path of the list of prefixes the sorter counts as an internal import.
 */
const OWN = "fmt.sortImports.internalPattern";

/**
 * Arguments for {@link skip}: the files the formatter leaves unchanged, and why.
 */
export interface Skipped {
  /**
   * Why the formatter leaves these files unchanged.
   */
  because: string;

  /**
   * Globs resolved against the directory the formatter runs in.
   */
  files: readonly string[];
}

/**
 * Arguments for {@link own}: the package prefixes a repository counts as its own code, and why.
 */
export interface Owned {
  /**
   * Why these prefixes name this repository's own code.
   */
  because: string;

  /**
   * Prefixes matched against the start of a specifier, never as regular expressions.
   */
  patterns: readonly string[];
}

/**
 * Arguments for {@link group}: an import group that sorts above every group already in the order,
 * and why.
 */
export interface Grouped {
  /**
   * Why the sorter separates these imports from the rest.
   */
  because: string;

  /**
   * The name the sorter gives the group, which is also the layer name.
   */
  name: string;

  /**
   * The patterns the sorter matches against an import specifier.
   */
  patterns: readonly string[];
}

/**
 * Returns the import order a group is about to join, out of the configuration built so far.
 *
 * @remarks
 *   A boolean `sortImports` turns sorting on without stating an order, so a group has nothing to
 *   join. It is refused the same way an absent setting is.
 * @throws {@link Error} When no layer above this one states an import order.
 */
function sorting(config: UserConfig, name: string): Sorted {
  const held = config.fmt?.sortImports;
  const sorted = typeof held === "object" ? held : undefined;

  if (sorted === undefined) {
    throw new Error(
      `fmt.group(${name}) has no import order to join: nothing above it sorts imports`,
    );
  }

  return sorted;
}

/**
 * Adds each glob to the list of files the formatter leaves unchanged.
 *
 * @remarks
 *   Each glob becomes a contribution named after itself rather than one contribution carrying the
 *   whole list, so removing a glob leaves every glob another layer added in place.
 * @returns One contribution per glob.
 */
export function skip(stated: Skipped): readonly Contribution[] {
  return stated.files.map((held) =>
    contribute({ at: SKIPPED, because: stated.because, item: held, name: `fmt.skip(${held})` }),
  );
}

/**
 * Adds the house list of generated files to the formatter's skip list.
 *
 * @remarks
 *   A formatted generated file no longer matches what its generator writes, so the next generator
 *   run reports a change nobody made.
 * @returns One contribution per glob in the house list.
 */
export function generated(): readonly Contribution[] {
  return skip({
    because: "written by a tool, and overwritten by it on the next run",
    files: GENERATED,
  });
}

/**
 * Adds each prefix to the set the sorter counts as this repository's own code.
 *
 * @remarks
 *   The contributions append to the house scope rather than replacing it, so a repository
 *   publishing under a second scope states only the second one.
 * @returns One contribution per prefix.
 */
export function own(stated: Owned): readonly Contribution[] {
  return stated.patterns.map((held) =>
    contribute({ at: OWN, because: stated.because, item: held, name: `fmt.own(${held})` }),
  );
}

/**
 * Returns an override that sorts the imports matching a set of patterns into a group of their own.
 *
 * @remarks
 *   The group is prepended, so it sorts above every group already in the order and the order
 *   beneath it is unchanged. Two modules each adding a group therefore both keep theirs.
 * @returns An override that refines `fmt.sortImports` when it is applied.
 * @throws {@link Error} When the configuration it refines states no import order. The refinement
 *   runs when the override is applied, not when this returns.
 */
export function group(stated: Grouped): Override {
  return override({
    because: stated.because,
    name: `fmt.group(${stated.name})`,
    refine: (_context, config: UserConfig): UserConfig => {
      const held = sorting(config, stated.name);

      return {
        ...config,
        fmt: {
          ...config.fmt,
          sortImports: {
            ...held,
            customGroups: [
              { elementNamePattern: [...stated.patterns], groupName: stated.name },
              ...(held.customGroups ?? []),
            ],
            groups: [stated.name, ...(held.groups ?? [])],
          },
        },
      };
    },
  });
}
