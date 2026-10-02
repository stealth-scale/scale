/**
 * Builds the catalogues a build writes beside a product for the services that grant access, serve
 * flags and publish operations.
 *
 * @remarks
 *   Every description is translated in each language the declaring plugin's catalogues contain,
 *   from the words the catalogue plugin found. A language whose catalogue lacks the key is left out
 *   of that description.
 */

import {
  type AccessCatalogue,
  type CataloguedOperation,
  type CatalogueEntry,
  type FlagCatalogue,
  type OperationCatalogue,
  type ResolvedName,
  type ResolvedOperationDeclaration,
  type ResolvedProduct,
} from "@stealthscale/sdk-core";
import { type CataloguesApi } from "@stealthscale/vite-plugin-i18n";

/**
 * Describes the three catalogues of one build.
 */
export interface Catalogues {
  /**
   * Every permission, resource kind, role and entitlement, for the access and licence services.
   */
  readonly access: AccessCatalogue;

  /**
   * Every flag and every kill switch, for the flag service.
   */
  readonly flags: FlagCatalogue;

  /**
   * Every query and mutation, for the gateway's publishing step.
   */
  readonly operations: OperationCatalogue;
}

/**
 * Translates a key of a plugin's catalogue into every language its catalogues contain.
 */
type Describe = (plugin: string, key: string) => Readonly<Record<string, string>>;

/**
 * Returns true where a value is an object whose members can be read by name.
 */
function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null;
}

/**
 * Returns the text at a dotted key of a catalogue, or undefined where the catalogue has none.
 */
function textAt(words: unknown, key: string): string | undefined {
  let node = words;

  for (const part of key.split(".")) node = isRecord(node) ? node[part] : undefined;

  return typeof node === "string" ? node : undefined;
}

/**
 * Returns a function that translates a plugin's key into each language of its catalogues, reading
 * each pair of language and namespace from the catalogue plugin once.
 *
 * @throws {@link Error} From the returned function, when a catalogue cannot be read, naming the
 *   plugin and the language.
 */
function describerOf(api: CataloguesApi): Describe {
  const languages = new Map<string, ReadonlySet<string>>();
  const read = new Map<string, unknown>();

  for (const { language, namespace } of api.catalogues()) {
    languages.set(namespace, new Set([...(languages.get(namespace) ?? []), language]));
  }

  /**
   * Returns the words of one pair, read once.
   *
   * @throws {@link Error} When the catalogue plugin cannot read the pair.
   */
  const wordsOf = (language: string, plugin: string): unknown => {
    const pair = `${language}/${plugin}`;

    try {
      if (!read.has(pair)) read.set(pair, api.words(language, plugin));
    } catch (error) {
      throw new Error(
        `The catalogue of ${plugin} in ${language} cannot be read: ${String(error)}`,
        {
          cause: error,
        },
      );
    }

    return read.get(pair);
  };

  return (plugin, key) =>
    Object.fromEntries(
      [...(languages.get(plugin) ?? [])].toSorted().flatMap((language) => {
        const text = textAt(wordsOf(language, plugin), key);

        return text === undefined ? [] : [[language, text]];
      }),
    );
}

/**
 * Returns the catalogue entry of a resolved name.
 */
function entryOf(name: ResolvedName, describe: Describe): CatalogueEntry {
  return {
    deprecated: name.deprecated,
    description: describe(name.plugin, name.description),
    id: name.id,
    plugin: name.plugin,
  };
}

/**
 * Orders two entries by their qualified ids.
 */
function byId(first: Pick<CatalogueEntry, "id">, second: Pick<CatalogueEntry, "id">): number {
  return first.id < second.id ? -1 : 1;
}

/**
 * Returns the catalogue entry of a query or a mutation.
 *
 * @param declaration - The resolved query or mutation.
 * @param kind - Whether the declaration is a query or a mutation.
 */
function operationOf(
  declaration: ResolvedOperationDeclaration,
  kind: CataloguedOperation["kind"],
): CataloguedOperation {
  return {
    id: declaration.operation.id,
    kind,
    name: declaration.id.slice(declaration.plugin.length + 1),
    plugin: declaration.plugin,
  };
}

/**
 * Builds the access, flag and operation catalogues of a resolved product.
 *
 * @remarks
 *   The access and flag lists are sorted by qualified id, so a diff of two releases' catalogues
 *   lists every added and removed name. The operations follow the order of the installed plugins.
 * @param product - The resolved product.
 * @param api - The catalogue plugin's api, which the descriptions are translated from.
 * @throws {@link Error} When a catalogue cannot be read for a description, naming the plugin and
 *   the language.
 */
export function cataloguesFor(product: ResolvedProduct, api: CataloguesApi): Catalogues {
  const describe = describerOf(api);
  const identity = { id: product.productId, version: product.version };

  return {
    access: {
      entitlements: product.entitlements.map((one) => entryOf(one, describe)).toSorted(byId),
      permissions: product.permissions
        .map((one) => ({ ...entryOf(one, describe), resource: one.resource }))
        .toSorted(byId),
      product: identity,
      resources: product.resources.map((one) => entryOf(one, describe)).toSorted(byId),
      roles: product.roles
        .map((one) => ({ ...entryOf(one, describe), permissions: one.permissions }))
        .toSorted(byId),
    },
    flags: {
      flags: product.flags
        .map((one) => ({
          ...entryOf(one, describe),
          default: one.default,
          expires: one.expires,
          kind: one.kind,
          product: one.product,
          variants: one.variants,
        }))
        .toSorted(byId),
      product: identity,
    },
    operations: {
      operations: product.plugins.flatMap(({ id }) => [
        ...product.queries
          .filter(({ plugin }) => plugin === id)
          .map((one) => operationOf(one, "query")),
        ...product.mutations
          .filter(({ plugin }) => plugin === id)
          .map((one) => operationOf(one, "mutation")),
      ]),
      product: identity,
    },
  };
}
