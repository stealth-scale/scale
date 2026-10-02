/**
 * A scratch product the composition specs run over.
 *
 * @remarks
 *   The application `@acme/people` installs one plugin, `time-off`. The plugin's web package
 *   depends on its contract package, and both are installed under the application's `node_modules`.
 *   `sdk-core` and `sdk-host` are linked there from this repository, so the definition evaluates
 *   the resolver's own source. The contract package contains the plugin's catalogue, and the
 *   application contains its own. A case passes files that replace or add to these.
 */

import { mkdirSync, symlinkSync } from "node:fs";
import { join } from "node:path";
import { type Plugin } from "vite";

import {
  configured,
  packageFiles,
  type ScratchFiles,
  type ScratchWorkspace,
  withScratchWorkspaceAsync,
} from "@stealthscale/testing";
import { importer } from "@stealthscale/vite-plugin-base";
import {
  type CataloguesApi,
  cataloguesOf,
  i18n,
  type Options,
} from "@stealthscale/vite-plugin-i18n";

import { compose, type Composition } from "#compose.ts";

/**
 * The application's path inside the scratch workspace.
 */
export const APP = "apps/people";

/**
 * The export conditions the product resolves under.
 */
export const CONDITIONS: readonly string[] = ["stealth-source", "node"];

/**
 * The definition's path from the application's root.
 */
export const DEFINITION = "src/product.ts";

/**
 * The web package's path inside the scratch workspace.
 */
export const WEB = `${APP}/node_modules/@acme/time-off`;

/**
 * The contract package's path inside the scratch workspace.
 */
export const CONTRACT = `${APP}/node_modules/@acme/time-off-contract`;

/**
 * This repository's `sdk-core`, which the application links.
 */
const SDK = join(import.meta.dirname, "..", "..", "..", "sdk", "core");

/**
 * This repository's `sdk-host`, which the application links for a standalone page's definition.
 */
const HOST = join(import.meta.dirname, "..", "..", "..", "sdk", "host");

/**
 * Returns the source of a contract package's entry that declares `time-off` with the members
 * given.
 *
 * @param members - The members of the contract's definition, as source.
 */
export function contractOf(members: string): string {
  return [
    'import { command, defineContract, route } from "@stealthscale/sdk-core";',
    "",
    `export const contract = defineContract("time-off", { ${members} });`,
    "",
  ].join("\n");
}

/**
 * The contract's members: one route in the main menu and one command bound to keys.
 */
export const MEMBERS = [
  'commands: { request: command({ keys: "Mod+Shift+R", label: "commands.request" }) },',
  'routes: { overview: route({ navigation: { label: "navigation.overview" }, path: "time-off" }) },',
].join(" ");

/**
 * The catalogue of the plugin's namespace, with every key the contract names.
 */
export const WORDS = {
  commands: { request: "Request time off" },
  navigation: { overview: "Time off" },
  plugin: { description: "Requests and balances", name: "Time off" },
};

/**
 * The files `withProduct` writes before a case's own.
 */
export const PRODUCT: ScratchFiles = {
  ...packageFiles(
    APP,
    {
      dependencies: { "@acme/time-off": "1", "@stealthscale/sdk-core": "1" },
      name: "@acme/people",
      private: true,
      type: "module",
    },
    {
      [DEFINITION]: [
        'import { defineProduct, installed } from "@stealthscale/sdk-core";',
        'import { manifest } from "@acme/time-off";',
        "",
        "export default defineProduct({",
        '  name: "product.name",',
        "  plugins: [installed(manifest)],",
        '  productId: "people",',
        '  version: "1.0.0",',
        "});",
        "",
      ].join("\n"),
      "locales/en/people.json": JSON.stringify({ product: { name: "People" } }),
    },
  ),
  ...packageFiles(
    WEB,
    {
      dependencies: { "@acme/time-off-contract": "1", "@stealthscale/sdk-core": "1" },
      exports: { ".": "./src/index.ts" },
      name: "@acme/time-off",
      type: "module",
    },
    {
      "src/index.ts": 'export { manifest } from "./manifest.ts";\n',
      "src/manifest.ts": [
        'import { definePlugin } from "@stealthscale/sdk-core";',
        'import { contract } from "@acme/time-off-contract";',
        "",
        "export const manifest = definePlugin(contract, {",
        '  commands: { request: { run: () => import("./request.ts") } },',
        '  routes: { overview: () => import("./overview.ts") },',
        "});",
        "",
      ].join("\n"),
      "src/overview.ts": "export function overview() {\n  return null;\n}\n",
      "src/request.ts": "export function request() {}\n",
    },
  ),
  ...packageFiles(
    CONTRACT,
    {
      dependencies: { "@stealthscale/sdk-core": "1" },
      exports: { ".": "./src/index.ts" },
      name: "@acme/time-off-contract",
      type: "module",
    },
    {
      "locales/en/time-off.json": JSON.stringify(WORDS),
      "src/index.ts": contractOf(MEMBERS),
    },
  ),
};

/**
 * Writes the scratch product with a case's files over {@link PRODUCT}, links `sdk-core` and
 * `sdk-host` into the application, and runs a function against the workspace.
 *
 * @param files - Files that replace or add to the product's.
 * @param run - The case's work, which the workspace outlives.
 */
export function withProduct<Result>(
  files: ScratchFiles,
  run: (workspace: ScratchWorkspace) => Promise<Result>,
): Promise<Result> {
  return withScratchWorkspaceAsync({ ...PRODUCT, ...files }, (workspace) => {
    mkdirSync(workspace.path(`${APP}/node_modules/@stealthscale`), { recursive: true });
    symlinkSync(SDK, workspace.path(`${APP}/node_modules/@stealthscale/sdk-core`), "dir");
    symlinkSync(HOST, workspace.path(`${APP}/node_modules/@stealthscale/sdk-host`), "dir");

    return run(workspace);
  });
}

/**
 * Files that make the application the web package of `time-off`, as a plugin's own package is
 * under its standalone page.
 */
export const STANDALONE: ScratchFiles = {
  [`${APP}/package.json`]: JSON.stringify({
    dependencies: {
      "@acme/time-off-contract": "1",
      "@stealthscale/sdk-core": "1",
      "@stealthscale/sdk-host": "1",
    },
    name: "@acme/time-off-web",
    private: true,
    type: "module",
  }),
  [`${APP}/src/manifest.ts`]: [
    'import { definePlugin } from "@stealthscale/sdk-core";',
    'import { contract } from "@acme/time-off-contract";',
    "",
    "export const manifest = definePlugin(contract, {",
    '  commands: { request: { run: () => import("./request.ts") } },',
    '  routes: { overview: () => import("./overview.ts") },',
    "});",
    "",
  ].join("\n"),
  [`${APP}/src/overview.ts`]: "export function overview() {\n  return null;\n}\n",
  [`${APP}/src/request.ts`]: "export function request() {}\n",
};

/**
 * Builds the catalogue plugin over the application, resolves its configuration, and returns it.
 *
 * @param root - The application's directory.
 * @param options - The catalogue plugin's options. Types are never written.
 */
export async function catalogued(root: string, options: Options = {}): Promise<Plugin> {
  const plugin = i18n({ ...options, types: false });

  await configured(plugin, { command: "serve", root });

  return plugin;
}

/**
 * Builds the catalogue plugin over the application and returns its api.
 *
 * @param root - The application's directory.
 * @param options - The catalogue plugin's options.
 * @throws {@link Error} When the catalogue plugin offers no api.
 */
export async function wordsAt(root: string, options: Options = {}): Promise<CataloguesApi> {
  const api = cataloguesOf([await catalogued(root, options)]);

  if (api === undefined) throw new Error("The catalogue plugin offers no api.");

  return api;
}

/**
 * Describes a composition of the scratch product, with the workspace's root its paths start from.
 */
export interface Composed {
  /**
   * The composition.
   */
  readonly composition: Composition;

  /**
   * The scratch workspace's root, which no longer exists once the composition returns.
   */
  readonly root: string;
}

/**
 * Composes the scratch product with a case's files over {@link PRODUCT}.
 *
 * @param files - Files that replace or add to the product's.
 * @param options - The catalogue plugin's options.
 */
export function composedWith(files: ScratchFiles = {}, options: Options = {}): Promise<Composed> {
  return withProduct(files, async (workspace) => {
    const root = workspace.path(APP);
    const through = await importer({ conditions: CONDITIONS, root });

    try {
      const composition = await compose({
        definition: DEFINITION,
        root,
        through,
        words: await wordsAt(root, options),
      });

      return { composition, root: workspace.root };
    } finally {
      await through.close();
    }
  });
}

/**
 * The second plugin's web package's path inside the scratch workspace.
 */
export const EXPENSES = `${APP}/node_modules/@acme/expenses`;

/**
 * Files that install a second plugin, `expenses`, after `time-off`, and add an entry module that
 * imports the product.
 */
export const TWO_PLUGINS: ScratchFiles = {
  [`${APP}/${DEFINITION}`]: [
    'import { defineProduct, installed } from "@stealthscale/sdk-core";',
    'import { manifest as expenses } from "@acme/expenses";',
    'import { manifest as timeOff } from "@acme/time-off";',
    "",
    "export default defineProduct({",
    '  name: "product.name",',
    "  plugins: [installed(timeOff), installed(expenses)],",
    '  productId: "people",',
    '  version: "1.0.0",',
    "});",
    "",
  ].join("\n"),
  [`${APP}/package.json`]: JSON.stringify({
    dependencies: {
      "@acme/expenses": "1",
      "@acme/time-off": "1",
      "@stealthscale/sdk-core": "1",
    },
    name: "@acme/people",
    private: true,
    type: "module",
  }),
  [`${APP}/src/main.ts`]:
    'import { product } from "virtual:product";\n\nexport const id = product.productId;\n',
  ...packageFiles(
    EXPENSES,
    {
      dependencies: { "@acme/expenses-contract": "1", "@stealthscale/sdk-core": "1" },
      exports: { ".": "./src/index.ts" },
      name: "@acme/expenses",
      type: "module",
    },
    {
      "src/claims.ts": "export function claims() {\n  return null;\n}\n",
      "src/index.ts": 'export { manifest } from "./manifest.ts";\n',
      "src/manifest.ts": [
        'import { definePlugin } from "@stealthscale/sdk-core";',
        'import { contract } from "@acme/expenses-contract";',
        "",
        'export const manifest = definePlugin(contract, { routes: { claims: () => import("./claims.ts") } });',
        "",
      ].join("\n"),
    },
  ),
  ...packageFiles(
    `${APP}/node_modules/@acme/expenses-contract`,
    {
      dependencies: { "@stealthscale/sdk-core": "1" },
      exports: { ".": "./src/index.ts" },
      name: "@acme/expenses-contract",
      type: "module",
    },
    {
      "locales/en/expenses.json": JSON.stringify({
        navigation: { claims: "Claims" },
        plugin: { description: "Claims and receipts", name: "Expenses" },
      }),
      "src/index.ts": [
        'import { defineContract, route } from "@stealthscale/sdk-core";',
        "",
        'export const contract = defineContract("expenses", {',
        '  routes: { claims: route({ navigation: { label: "navigation.claims" }, path: "claims" }) },',
        "});",
        "",
      ].join("\n"),
    },
  ),
};
