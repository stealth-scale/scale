/**
 * Composes a product: imports its definition through Vite, finds its plugins' packages, and
 * resolves it with the words the catalogue plugin found.
 */

import { validateHotkey } from "@tanstack/hotkeys";
import { join } from "node:path";

import { type ProductDefinition, type Resolution, resolveProduct } from "@stealthscale/sdk-core";
import { type Imported, type Importer } from "@stealthscale/vite-plugin-base";
import { type CataloguesApi } from "@stealthscale/vite-plugin-i18n";

import { discover, type Discovery } from "#discover.ts";
import { hintsOf, wordsOf } from "#words.ts";

/**
 * Lists what a composition reads.
 */
export interface Composing {
  /**
   * Path of the definition module, from the project root.
   */
  readonly definition: string;

  /**
   * The project root, whose dependencies are walked.
   */
  readonly root: string;

  /**
   * The importer the definition is imported through, opened and closed by the caller.
   */
  readonly through: Importer;

  /**
   * The catalogue plugin's api.
   */
  readonly words: CataloguesApi;
}

/**
 * Describes one composition of a product.
 */
export interface Composition {
  /**
   * Each installed plugin's contract package and web package.
   */
  readonly discovery: Discovery;

  /**
   * Every file the definition's evaluation read. A change to one of them composes the product
   * again.
   */
  readonly files: readonly string[];

  /**
   * Lines that explain a problem the resolver reports, such as a contract package whose
   * catalogues the i18n layer does not follow.
   */
  readonly hints: readonly string[];

  /**
   * The problems, the warnings, and the resolved product where no problem was found.
   */
  readonly resolution: Resolution;
}

/**
 * The module an import of the definition returns.
 */
type Definitions = Readonly<Record<string, unknown>>;

/**
 * Returns the message of an error, or the value written as text.
 */
function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Imports the definition module through the importer.
 *
 * @throws {@link Error} When the module or anything it imports fails to load in Node, with the rule
 *   a web package's main entry follows.
 */
async function evaluated(
  through: Importer,
  file: string,
  definition: string,
): Promise<Imported<Definitions>> {
  try {
    return await through.import<Definitions>(file);
  } catch (error) {
    throw new Error(
      `${definition} failed to load in Node: ${messageOf(error)}. The build evaluates the definition, every contract and every manifest entry in Node. A web package's main entry imports its components and React through lazy importers alone.`,
      { cause: error },
    );
  }
}

/**
 * Returns the definition a module exports by default.
 *
 * @throws {@link Error} When the module has no default export that is an object.
 */
function definitionOf(module: Definitions, definition: string): ProductDefinition {
  const exported = module["default"];

  if (typeof exported !== "object" || exported === null) {
    throw new Error(
      `${definition} has no default export, and the build reads the product's definition from it.`,
    );
  }

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the resolver checks the shape of every member before it reads one
  return exported as ProductDefinition;
}

/**
 * Composes a product from its definition.
 *
 * @remarks
 *   The importer resolves every package through Vite under the product's conditions. The resolver
 *   checks the shape of every member of the definition before it reads one.
 * @param composing - The definition's path, the project root, the importer and the catalogue
 *   plugin's api.
 * @returns The packages found, the files read, the hints and the resolution.
 * @throws {@link Error} When the definition fails to load, or has no default export.
 */
export async function compose(composing: Composing): Promise<Composition> {
  const { definition, root, through, words } = composing;
  const file = join(root, definition);
  const imported = await evaluated(through, file, definition);
  const stated = definitionOf(imported.module, definition);
  const discovery = discover(stated, imported.loaded, root, file);
  const resolution = resolveProduct(stated, discovery.packages, {
    ...wordsOf(words, discovery.contracts),
    validateHotkey,
  });

  return {
    discovery,
    files: imported.files,
    hints: hintsOf(words, discovery.contracts),
    resolution,
  };
}
