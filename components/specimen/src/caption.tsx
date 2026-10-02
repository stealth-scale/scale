/**
 * Writes the line above one drawing of a component: the prop it was set on, and the value it was
 * set to.
 *
 * @remarks
 *   The words and the look they are drawn in, rather than a component that draws both. A matrix
 *   and a sample each style the line a caption occupies already, so each carries these words on
 *   the element it styles and the document holds one element where it used to hold two. A caller
 *   that styles no line of its own draws the library's paragraph round them itself.
 */

import { type ReactNode } from "react";

import { Text, type TextProps } from "@stealthscale/component-typography";

/**
 * The size and the ink a caption is drawn in, which every part that carries one takes as its own
 * defaults.
 *
 * @remarks
 *   The muted ink and no quieter. A line this small in a lighter ink fails the contrast every
 *   theme guarantees. Both inks are tones of the library's paragraph, so a theme that moves them
 *   moves the caption with them.
 */
export const CAPTION: Pick<TextProps, "size" | "tone"> = { size: "sm", tone: "muted" };

/**
 * Writes what a caption says: the prop in the muted ink where the axis names one, then the value
 * in full ink.
 *
 * @remarks
 *   The prop is written before the value and left in the muted ink, because the prop is the same
 *   on every cell and the value is what changes. The value states the same size as the line around
 *   it, because a nested text would otherwise take the middle size and the two halves of one line
 *   would read at two sizes.
 * @param children - The value the cell was drawn for.
 * @param knob - The prop the value was set on, left out where the axis names none.
 * @returns The prop and the value, in their two inks.
 */
export function captioned(children: string, knob?: string): ReactNode {
  return (
    <>
      {knob === undefined ? null : `${knob} = `}
      <Text as="span" size="sm" tone="default" weight="medium">
        {children}
      </Text>
    </>
  );
}
