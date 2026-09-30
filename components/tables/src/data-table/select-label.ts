/**
 * Renders the hidden label of a checkbox that selects rows.
 *
 * @remarks
 *   The forms checkbox points its input's `aria-labelledby` at its label, so the label renders and
 *   the recipe's `visuallyHidden` slot hides it from view. A screen reader reads it as the box's
 *   name.
 */

import { type ComponentProps } from "react";

import { Checkbox } from "@stealthscale/component-forms";

import { withContext } from "#data-table/context.ts";

/**
 * Renders the forms checkbox's label with the recipe's visually hidden class.
 */
export const SelectLabel = withContext(Checkbox.Label, "visuallyHidden");

/**
 * Describes the props of the hidden label: the props of the checkbox's label.
 */
export type SelectLabelProps = ComponentProps<typeof SelectLabel>;
