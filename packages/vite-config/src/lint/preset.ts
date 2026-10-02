/**
 * Assembles the lint layers a package extends, one tier at a time.
 *
 * @remarks
 *   Each tier returns a preset layer carrying the whole block, followed by the
 *   departures that go with it. A repository drops any one of them by name
 *   instead of rebuilding the list.
 */

import { type UserConfig } from "vite";

import { type Layer, preset } from "@stealthscale/vite-config-core";

import { GENERATED } from "#ignore/generated.ts";
import {
  barrelled,
  composed,
  defaultExported,
  registered,
  specified,
  undocumented,
} from "#lint/departure.ts";
import * as rules from "#lint/rules/index.ts";

/**
 * The shape Vite accepts under the `lint` key of a config.
 */
type LintBlock = NonNullable<UserConfig["lint"]>;

/**
 * Presents a plugin's rules as the rule map Vite's own types describe.
 *
 * @remarks
 *   A plugin rule is named `plugin/rule`, and the linter publishes no union
 *   covering those names. Every rule group passes through here before the
 *   block contains it.
 */
function asRules(held: rules.PluginRules): NonNullable<LintBlock["rules"]> {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- a plugin's rule name is in no map the linter publishes
  return held as NonNullable<LintBlock["rules"]>;
}

/**
 * The globs whose files a tool reads through their default export: a configuration, and the
 * preset a package publishes under `./theme`.
 */
const DEFAULT_EXPORTED = ["**/*.config.ts", "**/src/theme.ts"];

/**
 * The globs excused from doc comments in every tier.
 */
const UNDOCUMENTED = ["**/*.spec.ts", "**/*.fixtures.ts"];

/**
 * The globs excused from doc comments only where a package renders.
 */
const RENDERED = ["**/*.spec.tsx", "**/*.fixtures.tsx"];

/**
 * The globs whose case titles are held to the house grammar in every tier.
 */
const SPECIFIED = ["**/*.spec.ts"];

/**
 * The globs whose case titles are held to it only where a package renders.
 */
const SPECIFIED_RENDERED = ["**/*.spec.tsx"];

/**
 * The globs of the barrels excused from the dependency cap in every tier.
 */
const BARRELLED = ["**/index.ts"];

/**
 * The globs of the fixtures excused from the dependency cap in every tier.
 */
const COMPOSED = ["**/*.fixtures.ts", "**/*.fixtures.tsx"];

/**
 * The globs of the presets excused from the dependency cap in every tier.
 */
const REGISTERED = ["**/src/theme.ts"];

/**
 * The block every tier starts from, before it adds its own rules.
 *
 * @remarks
 *   A tier decides which rules run. It never decides how loudly they report,
 *   because the categories named here deny a finding in all three.
 */
const SHARED: LintBlock = {
  categories: rules.CATEGORIES,
  ignorePatterns: [...GENERATED],
  jsPlugins: rules.JS_PLUGINS,
  options: { typeAware: true, typeCheck: true },
  plugins: rules.PLUGINS,
  settings: rules.DOCBLOCK_SETTINGS,
};

/**
 * Lints a package that neither the console nor the browser runs on its own.
 *
 * @remarks
 *   No environment is declared, so nothing here tells the linter that `process`
 *   or `document` exists. A package reaching for either one extends
 *   {@link node} or {@link web} instead.
 */
export function base(): readonly Layer[] {
  return [
    preset({
      config: { lint: { ...SHARED, rules: asRules(rules.base()) } },
      name: "lint.base",
    }),
    defaultExported(DEFAULT_EXPORTED),
    undocumented(UNDOCUMENTED),
    specified(SPECIFIED),
    barrelled(BARRELLED),
    composed(COMPOSED),
    registered(REGISTERED),
  ];
}

/**
 * Lints a package the console runs.
 *
 * @remarks
 *   Node globals are declared and browser globals are not. The rules are the
 *   base tier's unchanged, since the markup group has no document to talk
 *   about.
 */
export function node(): readonly Layer[] {
  return [
    preset({
      config: { lint: { ...SHARED, env: { node: true }, rules: asRules(rules.node()) } },
      name: "lint.node",
    }),
    defaultExported(DEFAULT_EXPORTED),
    undocumented(UNDOCUMENTED),
    specified(SPECIFIED),
    barrelled(BARRELLED),
    composed(COMPOSED),
    registered(REGISTERED),
  ];
}

/**
 * Lints a package the browser runs.
 *
 * @remarks
 *   Browser globals are declared and the markup group is added. The `.tsx`
 *   globs join both departure lists here and in no other tier, so a rendered
 *   specification is excused and held to its grammar only where it can exist.
 */
export function web(): readonly Layer[] {
  return [
    preset({
      config: { lint: { ...SHARED, env: { browser: true }, rules: asRules(rules.web()) } },
      name: "lint.web",
    }),
    defaultExported(DEFAULT_EXPORTED),
    undocumented([...UNDOCUMENTED, ...RENDERED]),
    specified([...SPECIFIED, ...SPECIFIED_RENDERED]),
    barrelled(BARRELLED),
    composed(COMPOSED),
    registered(REGISTERED),
  ];
}
