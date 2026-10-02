/**
 * Types how a form is rendered: the members in order, the groups and steps that contain them, and
 * the settings of one field.
 */

import { type Path } from "#path.ts";

/**
 * Lists the widths a field's control takes, from the narrowest.
 */
export const WIDTHS = ["short", "medium", "full"] as const;

/**
 * Describes how wide a field's control is: `short` for a number, a date or a code, `medium` for an
 * account or a phone number, and `full` for the column.
 */
export type FieldWidth = (typeof WIDTHS)[number];

/**
 * Describes how one field is rendered.
 */
export interface Field {
  /**
   * The purpose of the field as the browser's `autocomplete` attribute names it: `email`,
   * `given-name`, `postal-code`. Written on the control, so a browser fills it and a person who
   * finds typing hard is asked once.
   */
  readonly autocomplete?: string | undefined;

  /**
   * Selects its renderer, by the name the renderer registered.
   */
  readonly control?: string | undefined;

  /**
   * The message identifier of its help text, where the derived one is wrong.
   */
  readonly description?: string | undefined;

  /**
   * The message identifier of its label, where the derived one is wrong.
   */
  readonly label?: string | undefined;

  /**
   * The renderer's own settings, such as a currency or a list of suggestions. Untrusted, because
   * a plugin writes it and the host renders it.
   */
  readonly options?: Readonly<Record<string, unknown>> | undefined;

  /**
   * The message identifier of its placeholder.
   */
  readonly placeholder?: string | undefined;

  /**
   * How many columns it takes, inside a group that states a count. One where it states none.
   */
  readonly span?: number | undefined;

  /**
   * How wide its control is. The renderer picks a width where this is absent.
   */
  readonly width?: FieldWidth | undefined;
}

/**
 * Describes a run of members, rendered as a fieldset where it has a legend and as bare layout where
 * it has none.
 *
 * @typeParam Values - The form's values, or `unknown` for a form without a type.
 */
export interface Group<Values = unknown> {
  /**
   * Whether it starts closed, which renders it as a disclosure. Needs a legend.
   */
  readonly closed?: boolean | undefined;

  /**
   * How many columns its members are laid across.
   */
  readonly columns?: number | undefined;

  /**
   * Whether its members run down the page or across it. Down where it states nothing.
   */
  readonly direction?: "column" | "row" | undefined;

  /**
   * Whether it renders a fieldset, and what the legend reads. `true` renders one and reads
   * `<id>.groups.<name>.legend`. A string names another identifier. Absent renders no fieldset.
   */
  readonly legend?: boolean | string | undefined;

  /**
   * A name, so a second presentation can replace this group rather than the whole list.
   */
  readonly name?: string | undefined;

  /**
   * Lists the members in the order they are rendered.
   */
  readonly of: ReadonlyArray<Member<Values>>;

  /**
   * The array path this group is rendered once per item of, with `[]` in its members bound to each
   * index. A group with one renders the add and remove controls as well, within the `minItems` and
   * `maxItems` the array's schema states.
   */
  readonly repeat?: Path<Values> | undefined;
}

/**
 * Describes one thing a group or a step contains: a field by its path, or a group of more.
 *
 * @typeParam Values - The form's values, or `unknown` for a form without a type.
 */
export type Member<Values = unknown> = Group<Values> | Path<Values>;

/**
 * Describes one step of a wizard, or one tab.
 *
 * @typeParam Values - The form's values, or `unknown` for a form without a type.
 */
export interface Step<Values = unknown> {
  /**
   * The message identifier of its label, where the derived one is wrong.
   */
  readonly label?: string | undefined;

  /**
   * The name its identifier is derived from.
   */
  readonly name: string;

  /**
   * Lists the members in the order they are rendered.
   */
  readonly of: ReadonlyArray<Member<Values>>;
}

/**
 * Describes the steps of a form, and which kind they are.
 *
 * @typeParam Values - The form's values, or `unknown` for a form without a type.
 */
export interface Steps<Values = unknown> {
  /**
   * The kind. A wizard validates a step before it is left, and tabs do not. A wizard where it
   * states none.
   */
  readonly kind?: "tabs" | "wizard" | undefined;

  /**
   * Lists the steps in the order they are walked.
   */
  readonly of: ReadonlyArray<Step<Values>>;
}

/**
 * Describes how a form is rendered.
 *
 * @remarks
 *   A stepped form's members are its steps' members, so `of` beside `steps` is refused when the
 *   presentation is read.
 * @typeParam Values - The form's values, where the form has a type. Then every path is checked
 *   against it. Left `unknown`, a path is a string, which is what a manifest has.
 */
export interface Presentation<Values = unknown> {
  /**
   * Per field, by the path into the values: `email`, `address.city`, `lines[].amount`.
   */
  readonly fields?: Readonly<Partial<Record<Path<Values>, Field>>> | undefined;

  /**
   * The identifier every message identifier of this form begins with.
   */
  readonly id: string;

  /**
   * The members the form renders, in order. Absent, every field the schema lists.
   */
  readonly of?: ReadonlyArray<Member<Values>> | undefined;

  /**
   * How the steps are walked.
   */
  readonly steps?: Steps<Values> | undefined;
}

/**
 * Reports whether a member is a group rather than a path.
 *
 * @typeParam Values - The form's values, or `unknown` for a form without a type.
 */
export function isGroup<Values>(member: Member<Values>): member is Group<Values> {
  return typeof member !== "string";
}
