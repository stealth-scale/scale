/**
 * Provides what the fields and the layouts of a form read from the form around them: the glyphs,
 * the level of a step's heading, the mark beside a label, where the labels go and the size.
 *
 * @remarks
 *   A field outside a form reads no glyph and no size, so it renders without glyphs at the size of
 *   the fieldset around it, or at `md`, marks a required field and puts its label above its
 *   control.
 */

import { createContext, type ReactNode, useContext } from "react";

/**
 * Describes the glyphs of a number field's steppers.
 */
export interface NumberGlyphs {
  /**
   * Glyph of the button that steps the value down, such as a minus.
   */
  readonly decrement: ReactNode;

  /**
   * Glyph of the button that steps the value up, such as a plus.
   */
  readonly increment: ReactNode;
}

/**
 * Describes the glyphs of a date picker field: the trigger that opens the calendar and the buttons
 * that move it a month.
 */
export interface DateGlyphs {
  /**
   * Glyph of the trigger that opens the calendar, such as a calendar.
   */
  readonly calendar: ReactNode;

  /**
   * Glyph of the button that shows the next month, such as a right chevron.
   */
  readonly next: ReactNode;

  /**
   * Glyph of the button that shows the month before, such as a left chevron.
   */
  readonly previous: ReactNode;
}

/**
 * Describes the glyphs of a password field's button, one for each thing a press does.
 */
export interface PasswordGlyphs {
  /**
   * Glyph of the button while the password is shown, which a press hides, such as a crossed-out
   * eye.
   */
  readonly hide: ReactNode;

  /**
   * Glyph of the button while the password is hidden, which a press shows, such as an eye.
   */
  readonly show: ReactNode;
}

/**
 * Describes the glyphs of a select field.
 */
export interface SelectGlyphs {
  /**
   * Glyph at the end of the trigger, such as a chevron.
   */
  readonly indicator: ReactNode;

  /**
   * Glyph at the end of the chosen row, such as a check.
   */
  readonly selected: ReactNode;
}

/**
 * Describes the glyphs a caller gives a form, each rendered where a field needs it.
 */
export interface FormGlyphs {
  /**
   * Glyph inside a checked box, such as a check.
   */
  readonly checkbox?: ReactNode;

  /**
   * Glyphs of a date picker field. A date picker field without them renders no trigger and no
   * calendar, so a person types the date.
   */
  readonly date?: DateGlyphs | undefined;

  /**
   * Glyph in the summary of a group that starts closed, such as a chevron, which turns while the
   * group is open.
   */
  readonly disclosure?: ReactNode;

  /**
   * Glyph before an error, such as a circled exclamation mark.
   */
  readonly error?: ReactNode;

  /**
   * Glyphs of a number field's steppers. A number field without them renders no steppers.
   */
  readonly number?: NumberGlyphs | undefined;

  /**
   * Glyphs of a password field's button. A password field without them renders no button.
   */
  readonly password?: PasswordGlyphs | undefined;

  /**
   * Glyph of the button that removes a tag, such as a cross. A tags field without it renders no
   * button, and Backspace removes the last tag.
   */
  readonly remove?: ReactNode;

  /**
   * Glyphs of a select field, which a combobox field and a phone field's country picker take too.
   */
  readonly select?: SelectGlyphs | undefined;
}

/**
 * Describes the fields a form marks beside their labels: the required ones with the required
 * indicator, or the optional ones with the optional indicator.
 */
export type FormMark = "optional" | "required";

/**
 * Describes where a form puts its labels against their controls: above every control, or inside
 * each empty text box until it takes focus or a value.
 */
export type FormOrientation = "floating" | "vertical";

/**
 * Describes the sizes a form offers.
 */
export type FormSize = "lg" | "md" | "sm";

/**
 * Describes the levels a step's heading renders at.
 */
export type HeadingLevel = 2 | 3 | 4 | 5 | 6;

/**
 * Describes what a form gives the fields and the layouts inside it.
 */
export interface FormScope {
  /**
   * Glyphs the caller gave the form.
   */
  readonly glyphs: FormGlyphs;

  /**
   * Level a wizard's step heading renders at.
   */
  readonly headingLevel: HeadingLevel;

  /**
   * Fields the form marks beside their labels.
   */
  readonly mark: FormMark;

  /**
   * Where the form puts the labels of its fields against their controls.
   */
  readonly orientation: FormOrientation;

  /**
   * Size every field of the form renders at, or nothing where the form states none.
   */
  readonly size?: FormSize | undefined;
}

/**
 * Scope a field reads outside a form: no glyph, a step heading at level 2, required fields
 * marked, labels above their controls, and no size.
 */
const LOOSE: FormScope = {
  glyphs: {},
  headingLevel: 2,
  mark: "required",
  orientation: "vertical",
};

/**
 * Context that provides the form's scope, with the loose scope outside a form.
 */
const FormScopeContext = createContext<FormScope>(LOOSE);

/**
 * Provides the form's scope to the fields inside it.
 */
export const FormScopeProvider = FormScopeContext;

/**
 * Returns the scope of the form around a field.
 *
 * @returns The form's scope, or the loose scope outside a form.
 */
export function useFormScope(): FormScope {
  return useContext(FormScopeContext);
}
