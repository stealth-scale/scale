/**
 * Derives the cases of every settings section a plugin declares: the section renders with its
 * defaults on its page, and the defaults of a section the form renders pass its schema.
 */

import { defaultEngine, defaultsOf } from "@stealthscale/provider-form";

import { audited } from "#audit.tsx";
import { type Check } from "#check.ts";
import { checking, validateEmpty } from "#resolution.ts";
import { type Subject } from "#subject.ts";

/**
 * Returns the cases of every settings section: its render on its page, and its defaults against
 * its schema where it states one.
 */
export function settingsCases(subject: Subject): readonly Check[] {
  return Object.values(subject.contract.settings.sections).flatMap((section) => {
    const page = { to: { id: `host/settings/${section.target.id}`, kind: "route" as const } };
    const rendering: Check = {
      name: `settings section ${section.id} renders with its defaults`,
      run: async () => {
        validateEmpty(await audited({ options: subject, route: page }));
      },
    };
    if (section.schema === undefined) return [rendering];

    const schema = { ...section.schema };

    return [
      rendering,
      {
        name: `settings section ${section.id}'s defaults pass its schema`,
        run: () =>
          checking(() => {
            const issues = defaultEngine().validate(schema, defaultsOf(schema));

            validateEmpty(
              issues.map(({ message, path }) => `${[section.id, ...path].join(".")} ${message}`),
            );
          }),
      },
    ];
  });
}
