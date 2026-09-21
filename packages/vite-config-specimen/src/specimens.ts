/**
 * Names the files every layer of this package treats as specimens, and renames a contribution a
 * layer borrows from the base configuration after this package.
 */

import { type Contribution, named } from "@stealthscale/vite-config-core";

/**
 * The files the linter and the runner treat as specimens, unless a caller names others.
 */
export const SPECIMENS: readonly string[] = ["**/*.specimen.tsx"];

/**
 * Renames a contribution borrowed from the base configuration, so its layer name identifies this
 * package and the call a consumer wrote.
 *
 * @param contribution - The contribution as the base configuration built it.
 * @param from - The base call's name, as it opens the contribution's name.
 * @param to - This package's name for it.
 * @returns The contribution under the new name.
 */
export function renamed(contribution: Contribution, from: string, to: string): Contribution {
  return named(contribution.name.replace(from, to), contribution);
}
