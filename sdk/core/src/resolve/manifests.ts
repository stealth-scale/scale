/**
 * Checks each installed plugin's manifest against its contract: code for every route, extension
 * and command, and no code for a name the contract does not declare.
 *
 * @remarks
 *   A settings section that renders a component needs one, which the settings check reports with
 *   the section. A schema section's entry is optional, for its migrations.
 */

import { WORDS } from "#assemble.ts";
import { type ReferenceKind } from "#reference.ts";
import { type ResolveContext } from "#resolve/context.ts";
import { declarationsOf } from "#resolve/declared.ts";
import { type Report } from "#resolve/problem.ts";
import { article } from "#resolve/shape.ts";

/**
 * The kinds whose every name needs code, by the member of a manifest's code that maps them.
 */
const CODED = [
  ["command", "commands"],
  ["extension", "extensions"],
  ["route", "routes"],
  ["settingsSection", "settings"],
] as const satisfies ReadonlyArray<readonly [ReferenceKind, string]>;

/**
 * Checks every installed plugin's code against the names its contract declares.
 *
 * @param context - The installed plugins, every declared name and the build's options.
 * @param report - The report the faults go into.
 */
export function checkManifests(context: ResolveContext, report: Report): void {
  for (const { manifest, pluginId } of context.installed.values()) {
    for (const [kind, member] of CODED) {
      const code = manifest.code[member] ?? {};
      const names = new Set(
        declarationsOf(context, kind)
          .filter(({ plugin }) => plugin === pluginId)
          .map(({ name }) => name),
      );

      for (const name of names) {
        if (kind !== "settingsSection" && !Object.hasOwn(code, name)) {
          report.problem(
            `${pluginId}.code.${member}.${name}`,
            `is missing, and the contract declares the ${WORDS[kind]}`,
          );
        }
      }

      for (const name of Object.keys(code).filter((one) => !names.has(one))) {
        report.problem(
          `${pluginId}.code.${member}.${name}`,
          `names ${article(WORDS[kind])} the contract does not declare`,
        );
      }
    }
  }
}
