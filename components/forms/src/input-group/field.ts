/**
 * Renders a field inside the input group.
 *
 * @remarks
 *   The field is a bare control: the group's box draws its edge, surface, focus ring and states.
 *   The element is an `input`. `as` renders a `textarea`, a `select`, or a component that renders
 *   an input and forwards its ref, such as a masked input. A field takes the free width, or the
 *   width of its `size` attribute when one is set. Name every field with a label or `aria-label`.
 */

import { type ComponentProps } from "react";

import { withContext } from "#input-group/context.ts";

/**
 * Renders the bare control with the group's field class.
 */
export const Field = withContext("input", "field");

/**
 * Describes the props of the field: the props of an `input` element.
 */
export type FieldProps = ComponentProps<typeof Field>;
