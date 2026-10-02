/**
 * Renders the handle a person drags sideways to change a number input's value.
 *
 * @remarks
 *   The element is a mark in the `presentation` role with the `ew-resize` cursor, and the glyph is
 *   the caller's. A press locks the pointer and every step of horizontal movement steps the value.
 *   The handle has no keyboard of its own: the input's arrow keys do the same.
 */

import { type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { Mark, type MarkProps } from "#input-group/mark.ts";
import { useNumberInput } from "#number-input/machine.ts";

/**
 * Describes the props of the scrubber: the props of a mark.
 */
export type ScrubberProps = MarkProps;

/**
 * Renders the scrubber as a mark with the machine's scrubber props.
 *
 * @param props - Attributes and children of the mark, merged over the machine's.
 * @returns The mark's `span` element.
 */
export function Scrubber(props: ScrubberProps): ReactElement {
  const api = useNumberInput();

  return <Mark {...mergeProps(api.getScrubberProps(), props)} />;
}
