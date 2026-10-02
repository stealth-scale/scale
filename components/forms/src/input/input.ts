/**
 * Renders a single-line text field through its recipe.
 *
 * @remarks
 *   The element is an `input` with no label of its own. Name it with a `label` that points at it,
 *   with `aria-label`, or by composing it into `Field`. The invalid styling reads `aria-invalid`,
 *   the attribute a screen reader also reads, so the component declares no invalid prop.
 */

import { type ComponentProps } from "react";

import { withContext } from "#input/context.ts";

/**
 * Renders an `input` element with the input recipe's classes.
 */
export const Input = withContext("input");

/**
 * Describes the props of Input: the recipe's variants and the props of an input element.
 */
export type InputProps = ComponentProps<typeof Input>;
