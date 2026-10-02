/**
 * Renders a password box bound to a string field of a form, with a button that shows and hides the
 * password.
 *
 * @remarks
 *   The box is the library's `PasswordInput`, which a schema picks for a string with
 *   `format: "password"`. The button renders where the field or the form gives the glyphs of its
 *   two states, and none otherwise. Its names and announcements read `<id>.actions.showPassword`,
 *   `hidePassword`, `passwordShown` and `passwordHidden`, else English. The browser fills the box
 *   as a new password where the presentation states `autocomplete: "new-password"`, and as the
 *   current password otherwise.
 *   Focus moving between the box and the button keeps the field, so its blur validators run once
 *   focus leaves both. In a form whose labels float, the label rests inside the box while it is
 *   empty.
 */

import { type ReactElement } from "react";

import { omitUndefined } from "@stealthscale/hooks";
import { useWords } from "@stealthscale/provider-form";

import { useBoundField } from "#form/bound.ts";
import { Frame, type FramedFieldProps } from "#form/frame.tsx";
import { isLeaving } from "#form/leaving.ts";
import { type PasswordGlyphs, useFormScope } from "#form/scope.ts";
import * as PasswordInput from "#password-input/index.ts";

/**
 * Lists the purposes a browser fills a password box for.
 */
const PURPOSES = ["current-password", "new-password"] as const;

/**
 * Reads the purpose the presentation states, or nothing for any other value, which leaves the box
 * filled as the current password.
 */
function purposeOf(autoComplete: string | undefined): (typeof PURPOSES)[number] | undefined {
  return PURPOSES.find((purpose) => purpose === autoComplete);
}

/**
 * Describes what a password field is given.
 */
export interface PasswordFieldProps extends FramedFieldProps {
  /**
   * Glyphs of the button, in place of the form's.
   */
  readonly glyphs?: PasswordGlyphs | undefined;
}

/**
 * Renders a password box in a frame, bound to the string field in scope.
 *
 * @param props - The words of the label, whether a value is required, the button's glyphs, the
 *   presentation and the width.
 * @returns The field, with the box and its button inside it.
 */
export function PasswordField({
  glyphs,
  label,
  presentation,
  required,
  width,
}: PasswordFieldProps): ReactElement {
  const field = useBoundField<string | undefined>();
  const words = useWords();
  const scope = useFormScope();
  const marks = glyphs ?? scope.glyphs.password;

  return (
    <Frame floats label={label} required={required} width={width ?? presentation?.width}>
      {({ autoComplete, name, placeholder }) => (
        <PasswordInput.Root
          {...omitUndefined({ autoComplete: purposeOf(autoComplete) })}
          onBlur={(event) => {
            if (isLeaving(event)) field.handleBlur();
          }}
        >
          <PasswordInput.Input
            name={name}
            onChange={(event) => {
              field.handleChange(event.target.value);
            }}
            placeholder={placeholder}
            value={field.state.value ?? ""}
          />
          {marks === undefined ? null : (
            <PasswordInput.VisibilityTrigger
              hiddenMessage={words.action("passwordHidden", "Your password is hidden")}
              label={words.action("showPassword", "Show password")}
              visibleLabel={words.action("hidePassword", "Hide password")}
              visibleMessage={words.action("passwordShown", "Your password is visible")}
            >
              <PasswordInput.Indicator fallback={marks.show}>{marks.hide}</PasswordInput.Indicator>
            </PasswordInput.VisibilityTrigger>
          )}
        </PasswordInput.Root>
      )}
    </Frame>
  );
}
