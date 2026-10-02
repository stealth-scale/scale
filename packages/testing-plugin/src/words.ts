/**
 * Derives the cases of a plugin's words: every key its contract names, and its own name and
 * description, in the fallback catalogue the specification's i18n instance loaded.
 *
 * @remarks
 *   The i18n layers of the package's configuration load every catalogue of the fallback language
 *   into the instance before the specification runs. The build's words check decides which keys a
 *   contract names, and a case reports the faults that check adds.
 */

import { getI18n } from "react-i18next";

import { type Problem } from "@stealthscale/sdk-core";

import { type Check } from "#check.ts";
import { checking, reportsOf, validateEmpty } from "#resolution.ts";
import { type Subject } from "#subject.ts";

/**
 * Returns true for an object whose members can be read by name.
 */
function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null;
}

/**
 * Returns the fallback catalogue of a namespace, or undefined where the instance loaded none.
 */
function catalogueOf(namespace: string): Readonly<Record<string, unknown>> | undefined {
  const i18n: ReturnType<typeof getI18n> | undefined = getI18n();
  const catalogue: unknown = i18n?.getResourceBundle(i18n.language, namespace);

  return isRecord(catalogue) ? catalogue : undefined;
}

/**
 * Returns true where a catalogue has a string at a dotted key.
 */
function has(catalogue: Readonly<Record<string, unknown>>, key: string): boolean {
  let node: unknown = catalogue;

  for (const part of key.split(".")) node = isRecord(node) ? node[part] : undefined;

  return typeof node === "string";
}

/**
 * Returns true where two faults state the same path and the same reason.
 */
function same(one: Problem, other: Problem): boolean {
  return one.path === other.path && one.reason === other.reason;
}

/**
 * Returns the case that fails where a key the contract names is missing from the plugin's fallback
 * catalogue.
 */
function keysCase(subject: Subject): Check {
  const { pluginId } = subject.contract;

  return {
    name: "every key the contract names is in the fallback catalogue",
    run: () =>
      checking(() => {
        const namespaces = [pluginId, ...subject.beside.map((one) => one.pluginId)];
        const catalogues = Object.fromEntries(
          namespaces.flatMap((namespace) => {
            const catalogue = catalogueOf(namespace);

            return catalogue === undefined ? [] : [[namespace, catalogue] as const];
          }),
        );

        if (catalogues[pluginId] === undefined) {
          throw new Error(`${pluginId} has no catalogue in the fallback language.`);
        }

        const before = reportsOf(subject).problems;
        const added = reportsOf(subject, { catalogues }).problems.filter(
          (one) => one.path.startsWith(`${pluginId}.`) && !before.some((other) => same(one, other)),
        );

        validateEmpty(added.map(({ path, reason }) => `${path} ${reason}`));
      }),
  };
}

/**
 * Returns the case that fails where the plugin's fallback catalogue lacks a key every plugin's
 * catalogue states.
 */
function ownCase(pluginId: string, key: string): Check {
  return {
    name: `${key} is in the fallback catalogue`,
    run: () =>
      checking(() => {
        const catalogue = catalogueOf(pluginId);

        if (catalogue === undefined || !has(catalogue, key)) {
          throw new Error(`The fallback catalogue of ${pluginId} lacks ${key}.`);
        }
      }),
  };
}

/**
 * Returns the cases of a plugin's words.
 */
export function wordCases(subject: Subject): readonly Check[] {
  const { pluginId } = subject.contract;

  return [
    keysCase(subject),
    ownCase(pluginId, "plugin.name"),
    ownCase(pluginId, "plugin.description"),
  ];
}
