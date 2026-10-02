/**
 * Reads and writes a settings section's values in a component.
 *
 * @remarks
 *   A section's values are stored per person and tenant, under
 *   `stealth.<productId>.<subject>.settings.<pluginId>.<section>`, so two people at one browser and
 *   one person in two tenants keep separate values.
 */

import { use, useEffect, useSyncExternalStore } from "react";

import {
  type Migration,
  pluginOf,
  type Product,
  type SettingsSectionReference,
  subjectOf,
  type ValuesOf,
} from "@stealthscale/sdk-core";
import { settingKey } from "@stealthscale/settings";

import { useHost } from "#host/use-host.ts";
import { useSelector } from "#host/use-selector.ts";
import { PluginContext } from "#scope/context.ts";
import { checked, defaultsOf, readSection } from "#settings/values.ts";

/**
 * Describes a section's values as a component reads them.
 */
export interface Settings<Values> {
  /**
   * Removes the stored value, so the section reads its defaults.
   *
   * @throws {@link Error} Where the section is another plugin's.
   */
  readonly reset: () => void;

  /**
   * Validates the change against the schema, writes it over the stored values, and renders the
   * section's readers again.
   *
   * @throws {@link Error} Where the section is another plugin's, no installed plugin declares it,
   *   or the schema refuses a value of the change.
   */
  readonly update: (change: Partial<Values>) => void;

  /**
   * The stored values over the schema's defaults.
   */
  readonly values: Values;
}

/**
 * The migrations of a section whose manifest states none.
 */
const NONE: Readonly<Record<number, Migration>> = {};

/**
 * Returns the migrations a section's manifest states, by the version each reads.
 */
function migrationsOf(product: Product, sectionId: string): Readonly<Record<number, Migration>> {
  const pluginId = pluginOf(sectionId);
  const name = sectionId.slice(pluginId.length + 1);

  return product.manifests[pluginId]?.code.settings?.[name]?.migrations ?? NONE;
}

/**
 * Validates that code in one plugin's scope writes that plugin's sections alone. The product's own
 * code, outside every plugin's scope, writes any section.
 *
 * @throws {@link Error} Where the writer is another plugin.
 */
function validateWriter(writer: string | undefined, sectionId: string): void {
  if (writer !== undefined && writer !== pluginOf(sectionId)) {
    throw new Error(
      `useSettings() in ${writer} cannot write ${sectionId}. A plugin writes its own settings sections alone.`,
    );
  }
}

/**
 * Returns a section's values, and renders again when they change in this tab or another.
 *
 * @remarks
 *   A plugin reads any section by reference and writes its own alone. A stored value goes through
 *   the read steps of `readSection`, and the hook reports each part it drops as `setting-dropped`
 *   once per stored value. A section no installed plugin declares reads as empty.
 */
export function useSettings<S extends SettingsSectionReference>(section: S): Settings<ValuesOf<S>> {
  const { product, report, settings, stores } = useHost("useSettings");
  const writer = use(PluginContext)?.pluginId;
  const subject = useSelector(
    [stores.session],
    () => subjectOf(stores.session.get().session) ?? "anyone",
  );
  const pluginId = pluginOf(section.id);
  const key = settingKey(
    product.productId,
    `${subject}.settings.${pluginId}.${section.id.slice(pluginId.length + 1)}`,
  );
  /**
   * Reads the text the section's key contains, in a browser and on a server alike.
   */
  const read = (): null | string => settings.read(key);
  const raw = useSyncExternalStore((onChange) => settings.subscribe(key, onChange), read, read);
  const resolved = product.settings.sections.find(({ id }) => id === section.id);
  const migrations = migrationsOf(product, section.id);
  const { kept } = readSection(raw, resolved, migrations);

  useEffect(() => {
    for (const reason of readSection(raw, resolved, migrations).dropped) {
      report({ key, kind: "setting-dropped", reason });
    }
  }, [key, migrations, raw, report, resolved]);

  return {
    reset: () => {
      validateWriter(writer, section.id);
      settings.clear(key);
    },
    update: (change) => {
      validateWriter(writer, section.id);

      if (resolved === undefined) {
        throw new Error(`useSettings() found no installed plugin that declares ${section.id}.`);
      }

      const { dropped } = checked(resolved.schema, change);

      if (dropped.length > 0) {
        throw new Error(`useSettings() refused a change to ${section.id}: ${dropped.join(", ")}.`);
      }

      settings.write(
        key,
        JSON.stringify({ values: { ...kept, ...change }, version: resolved.schemaVersion }),
      );
    },
    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- readSection keeps the properties the section's schema accepts, over the schema's defaults, which ValuesOf types
    values: { ...defaultsOf(resolved?.schema), ...kept } as ValuesOf<S>,
  };
}
