/**
 * Renders one settings section under its heading: its form where it states a schema, and its
 * manifest's component where it states none.
 */

import { type ReactElement } from "react";

import { Section } from "@stealthscale/component-screen";
import { useTranslation } from "@stealthscale/provider-i18n";
import { type ResolvedSettingsSection } from "@stealthscale/sdk-core";

import { pluginWordsOf } from "#host/words.ts";
import { ComponentSection } from "#settings/component-section.ts";
import { Guarded } from "#settings/guarded.tsx";
import { SchemaSection } from "#settings/schema-section.tsx";

/**
 * Describes the props of a settings section: the section.
 */
export interface SettingsSectionPartProps {
  /**
   * The section.
   */
  readonly section: ResolvedSettingsSection;
}

/**
 * Renders the section's heading, translated in its plugin's catalogue, beside its content.
 *
 * @returns A `section` element named by its heading.
 */
export function SettingsSection({ section }: SettingsSectionPartProps): ReactElement {
  const { i18n } = useTranslation("host");

  return (
    <Section.Root annotated>
      <Section.Header>
        <Section.Title>{pluginWordsOf(i18n).t(section.plugin, section.label)}</Section.Title>
      </Section.Header>
      <Section.Body>
        <Guarded section={section}>
          {section.schema === undefined ? (
            <ComponentSection section={section} />
          ) : (
            <SchemaSection schema={section.schema} section={section} />
          )}
        </Guarded>
      </Section.Body>
    </Section.Root>
  );
}
