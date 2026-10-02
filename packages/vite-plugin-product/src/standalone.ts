/**
 * Writes the standalone page of a plugin: the definition of the product that runs the plugin, the
 * page's document and the page's entry.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, posix, relative } from "node:path";
import { normalizePath } from "vite";

import { literal, quoted } from "@stealthscale/vite-plugin-base";

/**
 * Lists what the standalone page of a plugin runs and offers.
 */
export interface StandalonePage {
  /**
   * Package names of the contracts installed beside the plugin, each from its contract alone. None
   * where left out.
   */
  readonly beside?: readonly string[] | undefined;

  /**
   * Path of a module, from the project root, whose `glyphs` export the page renders with. None
   * where left out.
   */
  readonly glyphs?: string | undefined;

  /**
   * The locales the page offers, the first its fallback. American English alone where left out.
   */
  readonly locales?: readonly [string, ...string[]] | undefined;

  /**
   * Path of the module that exports the plugin's manifest, from the project root.
   * `src/manifest.ts` where left out.
   */
  readonly manifest?: string | undefined;

  /**
   * The themes the page offers, by name. The application's one theme where left out.
   */
  readonly themes?: readonly string[] | undefined;
}

/**
 * Path of the generated definition, from the project root.
 */
export const GENERATED = "node_modules/.stealth/standalone/product.ts";

/**
 * The specifier the page imports the generated definition by.
 */
export const PRODUCT = "virtual:standalone-product";

/**
 * Path of the manifest module where the page states none.
 */
const MANIFEST = "src/manifest.ts";

/**
 * The page's document, from the project root.
 */
const DOCUMENT = "index.html";

/**
 * The specifier of the page's entry.
 */
const ENTRY = "virtual:standalone";

/**
 * The resolved id of the page's entry, behind the NUL that marks it as generated.
 */
const RESOLVED_ENTRY = `\0${ENTRY}`;

/**
 * The resolved id of the definition the page imports, behind the NUL that marks it as generated.
 */
const RESOLVED_PRODUCT = `\0${PRODUCT}`;

/**
 * The resolved id of each module the page imports by a specifier of its own.
 */
const SPECIFIED: ReadonlyMap<string, string> = new Map([
  [`/@id/${ENTRY}`, RESOLVED_ENTRY],
  [ENTRY, RESOLVED_ENTRY],
  [PRODUCT, RESOLVED_PRODUCT],
]);

/**
 * The language of the document where the page states no locale.
 */
const LANGUAGE = "en-US";

/**
 * Returns the source of a definition that passes the plugin's manifest module and each contract
 * package beside it to `standaloneFrom`.
 *
 * @param from - The specifier the definition imports the manifest module by.
 * @param page - The manifest module and the contract packages beside the plugin.
 */
function sourceOf(from: string, page: StandalonePage): string {
  const beside = page.beside ?? [];

  return [
    'import { standaloneFrom } from "@stealthscale/sdk-host/standalone";',
    "",
    `import * as plugin from ${quoted(from)};`,
    ...beside.map((name, index) => `import * as beside${String(index)} from ${quoted(name)};`),
    "",
    "export default standaloneFrom(",
    `  { from: ${quoted(page.manifest ?? MANIFEST)}, module: plugin },`,
    "  [",
    ...beside.map(
      (name, index) => `    { from: ${quoted(name)}, module: beside${String(index)} },`,
    ),
    "  ],",
    ");",
    "",
  ].join("\n");
}

/**
 * Returns the source of the generated definition, which the build imports in Node.
 *
 * @remarks
 *   The definition imports the manifest module by a path relative to its own directory, three
 *   levels under the project root, so the path starts with `../`.
 * @param root - The project root.
 * @param page - The manifest module and the contract packages beside the plugin.
 */
export function definitionOf(root: string, page: StandalonePage): string {
  const manifest = join(root, page.manifest ?? MANIFEST);

  return sourceOf(normalizePath(relative(dirname(join(root, GENERATED)), manifest)), page);
}

/**
 * Writes the generated definition under the project root, and leaves a file with the same source
 * untouched.
 *
 * @remarks
 *   A file left untouched keeps its time of change, so the watcher reports no change and the
 *   product is not composed again.
 * @param root - The project root.
 * @param page - The manifest module and the contract packages beside the plugin.
 */
export function generate(root: string, page: StandalonePage): void {
  const file = join(root, GENERATED);
  const source = definitionOf(root, page);

  if (existsSync(file) && readFileSync(file, "utf8") === source) return;

  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, source);
}

/**
 * Returns the source of the page's document: an element with the id `root`, and the entry.
 */
function documentOf(page: StandalonePage): string {
  const [language = LANGUAGE] = page.locales ?? [];

  return [
    "<!doctype html>",
    `<html lang=${quoted(language)}>`,
    "  <head>",
    '    <meta charset="utf-8" />',
    '    <meta name="viewport" content="width=device-width, initial-scale=1" />',
    "    <title>Standalone page</title>",
    "  </head>",
    "  <body>",
    '    <div id="root"></div>',
    `    <script type="module" src="/@id/${ENTRY}"></script>`,
    "  </body>",
    "</html>",
    "",
  ].join("\n");
}

/**
 * Returns the source of the page's entry, which renders the page over `virtual:product` and
 * `virtual:i18n`.
 *
 * @remarks
 *   The entry imports the stylesheet alone, and the page's modules through `import()`. The bundled
 *   dev server installs the React refresh runtime in the entry's own body, and a chunk the entry
 *   imports statically runs before that body, so a component in a chunk the bundler shares between
 *   the entry and a lazy module would run before the runtime and throw. Behind `import()`, every
 *   component runs after it. The entry awaits nothing at its top level, because a module with a
 *   top-level await makes the bundler move every module it shares with a lazy module into a chunk
 *   of its own.
 */
function entryOf(page: StandalonePage): string {
  const { glyphs, locales, themes } = page;
  const members = [
    "catalogues",
    ...(glyphs === undefined ? [] : ["glyphs"]),
    ...(locales === undefined ? [] : [`locales: ${literal(locales, "standalone.locales")}`]),
    "product",
    ...(themes === undefined ? [] : [`themes: ${literal(themes, "standalone.themes")}`]),
  ];
  const modules = [
    ["{ renderStandalone }", quoted("@stealthscale/sdk-host/standalone/app")],
    ["{ catalogues }", quoted("virtual:i18n")],
    ["{ product }", quoted("virtual:product")],
    ...(glyphs === undefined
      ? []
      : [["{ glyphs }", quoted(posix.join("/", normalizePath(glyphs)))]]),
  ];

  return [
    'import "@stealthscale/theme/styles.css";',
    "",
    "async function start() {",
    `  const [${modules.map(([names]) => names).join(", ")}] = await Promise.all([`,
    ...modules.map(([, from]) => `    import(${String(from)}),`),
    "  ]);",
    "",
    `  await renderStandalone({ ${members.join(", ")} });`,
    "}",
    "",
    "void start();",
    "",
  ].join("\n");
}

/**
 * Returns the id the page's document, its entry or its definition resolves to, and undefined for
 * any other specifier.
 *
 * @param root - The project root.
 * @param id - The specifier.
 */
export function pageIdOf(root: string, id: string): string | undefined {
  const document = normalizePath(join(root, DOCUMENT));

  if (id === DOCUMENT || id === `/${DOCUMENT}` || id === document) return document;

  return SPECIFIED.get(id);
}

/**
 * Returns the source of the page's document, its entry or its definition, and undefined for any
 * other id.
 *
 * @remarks
 *   The definition the page imports is the generated definition with its manifest module imported
 *   from the project root. An application's chunks place every module under `node_modules` in the
 *   vendor chunk, and the generated file there would import the entry chunk that imports it, so the
 *   definition would run before the manifest module.
 * @param root - The project root.
 * @param page - The page's manifest module, contracts, locales, themes and glyphs.
 * @param id - The resolved id.
 */
export function pageSourceOf(root: string, page: StandalonePage, id: string): string | undefined {
  if (id === normalizePath(join(root, DOCUMENT))) return documentOf(page);
  if (id === RESOLVED_ENTRY) return entryOf(page);

  return id === RESOLVED_PRODUCT
    ? sourceOf(posix.join("/", normalizePath(page.manifest ?? MANIFEST)), page)
    : undefined;
}
