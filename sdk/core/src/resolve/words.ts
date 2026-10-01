/**
 * Checks every catalogue key a contract names, and the product's name, against the fallback
 * language's catalogues.
 *
 * @remarks
 *   The checks run where the build passes the catalogues. Every plugin's catalogue defines
 *   `plugin.name` and `plugin.description`, which the host shows on the Plugins page. A schema
 *   section's form reads `settings.<section>.fields.<property>.label`, and a choice's text
 *   `settings.<section>.fields.<property>.options.<value>`. A configuration schema and a section's
 *   schema are the plugin's own data, so their keys are read where the schema states them.
 */

import { type ReferenceKind } from "#reference.ts";
import { type Declaration, pathOf, type ResolveContext } from "#resolve/context.ts";
import { declarationsOf, type Declared } from "#resolve/declared.ts";
import { type Report } from "#resolve/problem.ts";
import { isRecord } from "#resolve/shape.ts";

/**
 * Describes one key a declaration names, with the path that names it.
 */
interface Keyed {
  /**
   * The key in the plugin's catalogue.
   */
  readonly key: string;

  /**
   * Dotted path of the value that names the key.
   */
  readonly path: string;
}

/**
 * Returns true where a catalogue has a string at a dotted key.
 *
 * @param catalogue - The catalogue, nested as the files nest it.
 * @param key - The dotted key.
 */
function has(catalogue: Readonly<Record<string, unknown>>, key: string): boolean {
  let node: unknown = catalogue;

  for (const part of key.split(".")) node = isRecord(node) ? node[part] : undefined;

  return typeof node === "string";
}

/**
 * Returns an object's members, or none where the value is not an object.
 *
 * @param value - Any value.
 */
function membersOf(value: unknown): ReadonlyArray<readonly [string, unknown]> {
  return isRecord(value) ? Object.entries(value) : [];
}

/**
 * Lists the keys a settings section's form reads: a label per property, and a text per choice.
 *
 * @param declaration - The declared section.
 */
function fieldsOf(declaration: Declaration<Declared<"settingsSection">>): readonly Keyed[] {
  const { name, reference } = declaration;
  const properties: unknown = reference.schema?.properties;

  return membersOf(properties).flatMap(([property, value]) => {
    const prefix = `settings.${name}.fields.${property}`;
    const path = `${pathOf(declaration)}.schema.properties.${property}`;
    const choices: unknown = isRecord(value) ? value["enum"] : undefined;
    const options = (Array.isArray(choices) ? choices : []).map((choice: unknown) => ({
      key: `${prefix}.options.${String(choice)}`,
      path: `${path}.enum`,
    }));

    return [{ key: `${prefix}.label`, path }].concat(options);
  });
}

/**
 * Lists every key one plugin's declarations and configuration name.
 *
 * @param context - The installed plugins, every declared name and the build's options.
 * @param pluginId - The plugin whose keys are listed.
 * @param config - The plugin's configuration schema, as its contract states it.
 */
function keysOf(context: ResolveContext, pluginId: string, config: unknown): readonly Keyed[] {
  /**
   * Lists the plugin's declared names of one kind.
   *
   * @param kind - The kind of the names.
   */
  const own = <K extends ReferenceKind>(kind: K): ReadonlyArray<Declaration<Declared<K>>> =>
    declarationsOf(context, kind).filter(({ plugin }) => plugin === pluginId);

  const described = [
    ...own("entitlement"),
    ...own("featureFlag"),
    ...own("permission"),
    ...own("resource"),
    ...own("role"),
  ];
  return [
    ...["plugin.name", "plugin.description"].map((key) => ({ key, path: pluginId })),
    ...own("command").map((one) => ({ key: one.reference.label, path: `${pathOf(one)}.label` })),
    ...described.map((one) => ({
      key: one.reference.description,
      path: `${pathOf(one)}.description`,
    })),
    ...own("route").flatMap((one) =>
      one.reference.navigation === undefined
        ? []
        : [{ key: one.reference.navigation.label, path: `${pathOf(one)}.navigation.label` }],
    ),
    ...[...own("settingsPage"), ...own("settingsSection")].map((one) => ({
      key: one.reference.label,
      path: `${pathOf(one)}.label`,
    })),
    ...own("settingsSection").flatMap((one) => fieldsOf(one)),
    ...membersOf(isRecord(config) ? config["properties"] : undefined).flatMap(
      ([name, property]) => {
        const key: unknown = isRecord(property) ? property["description"] : undefined;

        return typeof key === "string"
          ? [{ key, path: `${pluginId}.config.properties.${name}.description` }]
          : [];
      },
    ),
  ];
}

/**
 * Checks every installed plugin's keys and the product's name against the fallback catalogues,
 * where the build passes them.
 *
 * @param context - The installed plugins, every declared name and the build's options.
 * @param report - The report the faults go into.
 */
export function checkWords(context: ResolveContext, report: Report): void {
  const { catalogues } = context.options;
  const { name, productId } = context.definition;

  if (catalogues === undefined) return;

  for (const { contract, pluginId } of context.installed.values()) {
    const catalogue = catalogues[pluginId];
    const keys = keysOf(context, pluginId, contract.config);

    if (catalogue === undefined) {
      report.problem(pluginId, "has no catalogue in the fallback language");

      continue;
    }

    for (const { key, path } of keys.filter((one) => !has(catalogue, one.key))) {
      report.problem(
        path,
        `names the key ${key}, which the fallback catalogue of ${pluginId} lacks`,
      );
    }
  }

  if (!has(catalogues[productId] ?? {}, name)) {
    report.problem(
      "product.name",
      `names the key ${name}, which the fallback catalogue of ${productId} lacks`,
    );
  }
}
