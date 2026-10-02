/**
 * Renders the profile form in two steps: starts from the saved record or the draft, writes the
 * draft as a person types, and saves the record on submit.
 */

import { type ReactElement } from "react";

import { useSchemaForm } from "@stealthscale/component-forms/form";
import { type SettingStore } from "@stealthscale/settings";

import { type Profile, writeProfile } from "#records.ts";
import { profile, type ProfileValues } from "#schema.ts";

/**
 * Describes what the profile form is given.
 */
export interface ProfileFormProps {
  /**
   * Receives the profile once it is saved.
   */
  readonly onSaved: (profile: Profile) => void;

  /**
   * The saved profile the form starts from.
   */
  readonly record: Profile;

  /**
   * Where the draft is kept.
   */
  readonly store: SettingStore;
}

/**
 * Renders the profile form.
 *
 * @remarks
 *   The draft is kept under the record's identifier, so a draft of one profile never opens over
 *   another. The form starts from the record's values written over the schema's defaults, and the
 *   draft's values written over those where there is a draft. The password is never in the draft,
 *   and the schema's default fills it back in. The hook writes the draft as a person types and
 *   forgets it once the submit returns, and `form.Fields` renders the steps, opens on the step the
 *   draft was left on, and writes the step as a person leaves it.
 */
export function ProfileForm({ onSaved, record, store }: ProfileFormProps): ReactElement {
  const { id, ...saved } = record;
  const form = useSchemaForm<ProfileValues>({
    draft: { app: "docs", id: `profile.${id}`, store },
    onSubmit: ({ value }) => {
      const { newPassword: _newPassword, ...rest } = value;

      writeProfile({ ...rest, id });
      onSaved({ ...rest, id });
    },
    schema: profile,
    values: saved,
  });

  return (
    <form.AppForm>
      <form.Form>
        <form.Fields />
      </form.Form>
    </form.AppForm>
  );
}
