/**
 * Demotes the stylesheet check to a reporting one while a repository works
 * through a backlog of violations.
 */

import { type Layer, named, remove } from "@stealthscale/vite-config-core";

import { check, type Checked } from "#plugin/check.ts";

/**
 * Configures the reporting check that replaces the failing one.
 *
 * @remarks
 *   The reporting check reads the same globs and rules the failing check was
 *   configured with.
 */
export interface Warned extends Checked {
  /**
   * Records why the repository reports stylesheet violations instead of
   * failing the build on them. The removal carries this reason.
   */
  because: string;
}

/**
 * Removes the failing check by name and adds a reporting check in its place.
 *
 * @remarks
 *   Composition resolves the removal against the layers listed above it. A
 *   configuration that lists this call before `layers()`, or without it,
 *   throws while it loads.
 * @returns The removal of `css.check`, then the reporting check.
 */
export function warn(stated: Warned): readonly Layer[] {
  const { because, ...checked } = stated;

  return [
    remove({ because, name: "css.warn", target: "css.check" }),
    named("css.warn", check({ ...checked, warn: true })),
  ];
}
