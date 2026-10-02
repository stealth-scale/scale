/**
 * Derives the cases the build's own checks decide: code for every declared name, each requirement,
 * and each flag's date.
 */

import { type Check } from "#check.ts";
import { checking, faultsAt, reportsOf, validateEmpty } from "#resolution.ts";
import { type Subject } from "#subject.ts";

/**
 * Returns the case that fails where the manifest lacks code for a declared name, or maps code to a
 * name the contract does not declare.
 */
export function manifestCase(subject: Subject): Check {
  const { pluginId } = subject.contract;

  return {
    name: "the manifest has code for every declared name",
    run: () =>
      checking(() => {
        validateEmpty(faultsAt(reportsOf(subject).problems, `${pluginId}.code`));
      }),
  };
}

/**
 * Returns one case per requirement, which fails where the plugin the requirement names is not
 * installed beside the plugin, or is installed at a version outside the range.
 */
export function requirementCases(subject: Subject): readonly Check[] {
  const { pluginId, requires } = subject.contract;

  return requires.map((requirement, index) => ({
    name: `requirement ${requirement.pluginId} ${requirement.range} admits the installed contract`,
    run: () =>
      checking(() => {
        const { problems, warnings } = reportsOf(subject);
        const path = `${pluginId}.requires.${String(index)}`;

        validateEmpty([...faultsAt(problems, path), ...faultsAt(warnings, path)]);
      }),
  }));
}

/**
 * Returns one case per flag with a date, which fails where today is later than the date.
 */
export function flagCases(subject: Subject): readonly Check[] {
  const { featureFlags, pluginId } = subject.contract;

  return Object.entries(featureFlags)
    .filter(([, flag]) => flag.expires !== undefined)
    .map(([name, flag]) => ({
      name: `flag ${flag.id} is not past its date`,
      run: () =>
        checking(() => {
          const path = `${pluginId}.featureFlags.${name}.expires`;

          validateEmpty(faultsAt(reportsOf(subject).warnings, path));
        }),
    }));
}
