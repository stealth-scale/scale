/**
 * Lists the cases of what a plugin declares: its code, its requirements, its routes, extensions and
 * commands, its slots and its settings sections.
 */

import { type Check } from "#check.ts";
import { declarationCases } from "#declarations.ts";
import { manifestCase, requirementCases } from "#declared.ts";
import { renderCases } from "#renders.tsx";
import { settingsCases } from "#settings.ts";
import { slotCases } from "#slots.ts";
import { type Subject } from "#subject.ts";

/**
 * Returns the cases of what a plugin declares, in the order the checks are listed.
 */
export function declaredCases(subject: Subject): readonly Check[] {
  return [
    manifestCase(subject),
    ...requirementCases(subject),
    ...declarationCases(subject),
    ...renderCases(subject),
    ...slotCases(subject),
    ...settingsCases(subject),
  ];
}
