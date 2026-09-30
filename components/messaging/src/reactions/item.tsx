/**
 * Renders one reaction: a toggle button with the glyph and the number of people who reacted.
 *
 * @remarks
 *   The element is the actions `Button`, extra small in the outline look, with `aria-pressed` from
 *   `pressed`: whether the reader is among the people who reacted. A pressed reaction takes the
 *   primary palette. The glyph and the count are hidden from a screen reader, which reads `label`
 *   in their place, so `label` states the reaction, the count and the reader's part, such as
 *   "Thumbs up, 3 people, including you". The item holds no state: the caller toggles `pressed` and
 *   `count` from `onClick`.
 */

import { type ReactElement } from "react";

import { Button, type ButtonProps } from "@stealthscale/component-actions";

import { withContext } from "#reactions/context.ts";

/**
 * Renders the `span` around the glyph.
 */
const Glyph = withContext("span", "glyph");

/**
 * Renders the `span` around the count.
 */
const Count = withContext("span", "count");

/**
 * Describes the props of a reaction: its count, its name, whether the reader reacted, and the
 * props of the actions `Button`.
 */
export interface ItemProps extends ButtonProps {
  /**
   * Number of people who reacted, rendered after the glyph when stated.
   */
  readonly count?: number | undefined;

  /**
   * Accessible name: the reaction, the count and whether the reader is among them.
   */
  readonly label: string;

  /**
   * Whether the reader is among the people who reacted.
   */
  readonly pressed?: boolean | undefined;
}

/**
 * Renders the reaction's button.
 *
 * @param props - The count, the name, whether the reader reacted, and the props of the actions
 *   `Button`, the glyph among its children.
 * @returns The `button` element.
 */
export function Item({
  children,
  count,
  label,
  pressed = false,
  ...props
}: ItemProps): ReactElement {
  return (
    <Button
      aria-label={label}
      aria-pressed={pressed}
      palette={pressed ? "primary" : "neutral"}
      size="xs"
      variant="outline"
      {...props}
    >
      <Glyph aria-hidden="true">{children}</Glyph>
      {count === undefined ? null : <Count aria-hidden="true">{count}</Count>}
    </Button>
  );
}
