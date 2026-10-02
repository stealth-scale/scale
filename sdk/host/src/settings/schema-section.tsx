/**
 * Renders a settings section's form from its schema, with the section's values, and saves them
 * through `useSettings`.
 */

import { type ReactElement } from "react";

import { useSchemaForm } from "@stealthscale/component-forms/form";
import { useTranslation } from "@stealthscale/provider-i18n";
import { useRouteContext } from "@stealthscale/provider-router";
import {
  type ResolvedSettingsSection,
  type SettingsSchema,
  type SettingsSectionReference,
} from "@stealthscale/sdk-core";
import { useSettings, useToaster } from "@stealthscale/sdk-plugin";

import { internalsOf } from "#host/internals.ts";
import { translatorOf } from "#host/words.ts";
import { type HostRouterContext } from "#routes/context.ts";

/**
 * Describes the props of a schema section: the section and its schema.
 */
export interface SchemaSectionProps {
  /**
   * The section's schema.
   */
  readonly schema: SettingsSchema;

  /**
   * The section.
   */
  readonly section: ResolvedSettingsSection;
}

/**
 * Renders the section's form, with the host's glyphs and a Save button.
 *
 * @remarks
 *   The form's id is `settings.<section name>`, so each word of the form is a key of the plugin's
 *   catalogue under `settings.<section name>`. A valid submission writes the values over the stored
 *   ones and raises a success toast, and the form keeps the values. An invalid one focuses the
 *   first refused field.
 * @returns The form.
 */
export function SchemaSection({ schema, section }: SchemaSectionProps): ReactElement {
  const { host }: HostRouterContext = useRouteContext({ strict: false });
  const { i18n, t } = useTranslation("host");
  const toaster = useToaster();
  const reference: SettingsSectionReference = { id: section.id, kind: "settingsSection" };
  const { update, values } = useSettings(reference);
  const form = useSchemaForm<Readonly<Record<string, unknown>>>({
    id: `settings.${section.id.slice(section.plugin.length + 1)}`,
    onSubmit: ({ value }) => {
      update(value);
      toaster.create({ title: t("settings.saved"), type: "success" });
    },
    schema: { ...schema },
    translate: translatorOf(i18n, section.plugin),
    values,
  });

  return (
    <form.AppForm>
      <form.Form glyphs={internalsOf(host).glyphs}>
        <form.Fields />
        <form.Submit>{t("settings.save")}</form.Submit>
      </form.Form>
    </form.AppForm>
  );
}
