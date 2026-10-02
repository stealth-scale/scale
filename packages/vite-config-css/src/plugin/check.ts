/**
 * Runs Stylelint over the stylesheets a package imports as it builds.
 */

import { createRequire } from "node:module";
import stylelint from "vite-plugin-stylelint";

import { contribute, type Contribution } from "@stealthscale/vite-config-core";

import { all } from "#rules/index.ts";

/**
 * The Vite config key the check appends its plugin to.
 */
const AT = "plugins";

/**
 * The absolute path to the shared config the rule sets layer over.
 *
 * @remarks
 *   The check assembles Stylelint's config in memory, which leaves Stylelint
 *   no directory to resolve a bare specifier against, so the path has to be
 *   absolute. A repository missing the peer dependency fails while this
 *   module loads.
 */
const STANDARD = createRequire(import.meta.url).resolve("stylelint-config-standard");

/**
 * The absolute paths of every Stylelint plugin the run loads.
 *
 * @remarks
 *   Stylelint treats a rule from a plugin it never loaded as unknown and
 *   fails the run, so this list is wider than what the rule sets actually
 *   turn on. A repository adding its own rule through `rules` can reach for
 *   any plugin named here.
 */
const PLUGINS = [
  "stylelint-order",
  "stylelint-use-nesting",
  "stylelint-high-performance-animation",
].map((name) => createRequire(import.meta.url).resolve(name));

/**
 * The stylesheets the check reads, the rules it adds, and whether a violation
 * fails the build.
 *
 * @remarks
 *   Every field is optional. An empty object checks the plugin's default globs
 *   against the four rule sets and fails the build on a violation.
 */
export interface Checked {
  /**
   * The globs to check, in place of the plugin's defaults.
   */
  also?: readonly string[];

  /**
   * The globs to leave unchecked, in place of the plugin's defaults.
   */
  except?: readonly string[];

  /**
   * Rules layered over the four sets, by Stylelint rule name. A rule one of
   * the sets already declares takes the value given here instead.
   */
  rules?: Readonly<Record<string, unknown>>;

  /**
   * Whether a violation is reported as a warning rather than failing the
   * build.
   */
  warn?: boolean;
}

/**
 * Builds the contribution that runs Stylelint over a package's stylesheets.
 *
 * @remarks
 *   The plugin runs both during a build and behind a development server, and
 *   caches nothing, so a rule the repository changes takes effect on the next
 *   run.
 * @param stated - The globs and rules the check reads. Omitting it checks the
 *   plugin's default globs against the four rule sets.
 * @returns A contribution named `css.check`, appended to Vite's plugin array.
 */
export function check(stated: Checked = {}): Contribution {
  return contribute({
    at: AT,
    because: "a stylesheet is the one thing in a repository the type checker never reads",
    item: stylelint({
      build: true,
      cache: false,
      config: { extends: [STANDARD], plugins: PLUGINS, rules: { ...all(), ...stated.rules } },
      dev: true,
      emitErrorAsWarning: stated.warn ?? false,
      ...(stated.also === undefined ? {} : { include: [...stated.also] }),
      ...(stated.except === undefined ? {} : { exclude: [...stated.except] }),
    }),
    name: "css.check",
  });
}
