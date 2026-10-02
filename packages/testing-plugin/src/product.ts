/**
 * Resolves the product a specification renders a plugin in, and seeds what the host reads at its
 * start: the person's switches and settings, and the data each operation serves.
 */

import { type Transport } from "@stealthscale/provider-data";
import { type Sample, sampledTransport } from "@stealthscale/provider-data/testing";
import {
  pluginOf,
  type PluginPackage,
  type Product,
  type ProductDefinition,
  resolveProduct,
  type Session,
  subjectOf,
} from "@stealthscale/sdk-core";
import { settingKey, type SettingStore } from "@stealthscale/settings";

/**
 * Lists the switches and the settings a render starts with.
 */
export interface Seeds {
  /**
   * Values per settings section, by the section's qualified id. The schemas' defaults where left
   * out.
   */
  readonly settings?: Readonly<Record<string, Readonly<Record<string, unknown>>>> | undefined;

  /**
   * Whether each plugin is switched on, by plugin id. Every plugin on where left out.
   */
  readonly switches?: Readonly<Record<string, boolean>> | undefined;
}

/**
 * Returns a package for every installed plugin. The resolver reads that a plugin has one, and a
 * specification runs inside the package it tests.
 */
export function packagesOf(definition: ProductDefinition): Readonly<Record<string, PluginPackage>> {
  return Object.fromEntries(
    definition.plugins.map(({ manifest }) => {
      const { pluginId } = manifest.contract;

      return [pluginId, { directory: ".", name: pluginId }];
    }),
  );
}

/**
 * Resolves a product's definition without the build, with each installed plugin's manifest.
 *
 * @throws {@link Error} Naming every problem, where the definition does not resolve.
 */
export function productOf(definition: ProductDefinition): Product {
  const { problems, product } = resolveProduct(definition, packagesOf(definition));

  if (product === undefined) {
    const listed = problems.map(({ path, reason }) => `${path} ${reason}`).join("; ");

    throw new Error(`The product does not resolve: ${listed}.`);
  }

  return {
    ...product,
    manifests: Object.fromEntries(
      definition.plugins.map(({ manifest }) => [manifest.contract.pluginId, manifest]),
    ),
  };
}

/**
 * Writes the switches and the settings a render starts with into the setting store, under the keys
 * the host reads for the session's subject.
 *
 * @remarks
 *   A switch is `on` or `off` under `<subject>.plugin.<pluginId>`, and a section's values are
 *   `{"values":…,"version":…}` under `<subject>.settings.<pluginId>.<section>`: the stored form of
 *   a person's choices, which a product's stored data keeps across its releases.
 * @throws {@link Error} Where no installed plugin declares a section the seeds name.
 */
export function seed(store: SettingStore, product: Product, session: Session, seeds: Seeds): void {
  const subject = subjectOf(session) ?? "anyone";

  /**
   * Returns the key of one of the subject's choices.
   */
  const keyOf = (name: string): string => settingKey(product.productId, `${subject}.${name}`);

  for (const [pluginId, on] of Object.entries(seeds.switches ?? {})) {
    store.write(keyOf(`plugin.${pluginId}`), on ? "on" : "off");
  }

  for (const [id, values] of Object.entries(seeds.settings ?? {})) {
    const section = product.settings.sections.find((one) => one.id === id);

    if (section === undefined) {
      throw new Error(`No installed plugin declares the settings section ${id}.`);
    }

    const plugin = pluginOf(id);
    const value = JSON.stringify({ values, version: section.schemaVersion });

    store.write(keyOf(`settings.${plugin}.${id.slice(plugin.length + 1)}`), value);
  }
}

/**
 * Returns a transport that serves each declared operation with its sample's data, and each
 * operation the samples name with that sample instead.
 *
 * @param product - The declared queries and mutations.
 * @param samples - Samples by operation id, over the declared ones.
 */
export function transportOf(
  product: Pick<Product, "mutations" | "queries">,
  samples: Readonly<Record<string, Sample>>,
): Transport {
  const declared = [...product.queries, ...product.mutations].map(
    ({ operation, sample }): readonly [string, Sample] => [operation.id, { data: sample.data }],
  );

  return sampledTransport({ ...Object.fromEntries(declared), ...samples });
}
