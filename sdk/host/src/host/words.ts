/**
 * Reads the words of the installed plugins' catalogues and of the product's own, which the host's
 * word types do not list.
 */

import { type Translate } from "@stealthscale/provider-form";
import { useTranslation, type UseTranslationResponse } from "@stealthscale/provider-i18n";
import { type Product } from "@stealthscale/sdk-core";

/**
 * Describes how a part of the host reads the words of a plugin's catalogue.
 */
export interface PluginWords {
  /**
   * Returns true where a plugin's catalogue states the key, in the language or its fallbacks.
   */
  readonly exists: (pluginId: string, key: string) => boolean;

  /**
   * Translates a key of a plugin's catalogue, with the values its text interpolates.
   */
  readonly t: (pluginId: string, key: string, values?: Readonly<Record<string, unknown>>) => string;
}

/**
 * Types the instance's lookups with a namespace and a key as plain strings.
 */
interface Untyped {
  /**
   * Returns true where the namespace states the key.
   */
  readonly exists: (key: string, options: Readonly<Record<string, unknown>>) => boolean;

  /**
   * Translates the first key of the namespace the catalogue states, with the values its text
   * interpolates.
   */
  readonly t: (
    key: readonly string[] | string,
    options: Readonly<Record<string, unknown>>,
  ) => string;
}

/**
 * Types the instance `useTranslation` returns.
 */
type Instance = UseTranslationResponse<"host", undefined>["i18n"];

/**
 * Returns the reader of the plugins' words over an i18next instance.
 *
 * @remarks
 *   A plugin's catalogue belongs to the product, so the host's generated word types list none of
 *   its keys, and the reader looks them up with plain strings.
 * @param i18n - The instance `useTranslation` returns.
 */
export function pluginWordsOf(i18n: Instance): PluginWords {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the plugins' catalogues belong to the product, which the host's word types do not list
  const untyped = i18n as unknown as Untyped;

  return {
    exists: (pluginId, key) => untyped.exists(key, { ns: pluginId }),
    t: (pluginId, key, values = {}) => untyped.t(key, { ...values, ns: pluginId }),
  };
}

/**
 * Returns the translator a settings section's form reads its words through: each key is looked up
 * in the catalogue of the section's plugin, and the form's default is returned where none is found.
 *
 * @param i18n - The instance `useTranslation` returns.
 * @param pluginId - Id of the plugin whose catalogue the form reads.
 */
export function translatorOf(i18n: Instance, pluginId: string): Translate {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the plugins' catalogues belong to the product, which the host's word types do not list
  const untyped = i18n as unknown as Untyped;

  return (keys, options) => untyped.t(keys, { ...options, ns: pluginId });
}

/**
 * Returns the product's name in the person's language, and renders again when the language
 * changes.
 *
 * @remarks
 *   The name is the key the product's definition states under `name`, translated in the product's
 *   own namespace, its id.
 */
export function useProductName(product: Pick<Product, "name" | "productId">): string {
  const { i18n } = useTranslation("host");

  return pluginWordsOf(i18n).t(product.productId, product.name);
}
