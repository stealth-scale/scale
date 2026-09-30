/**
 * Renders the handle a drag starts from: the actions `Button`, square and ghost, with the caller's
 * glyph.
 *
 * @remarks
 *   The handle is a tab stop named after its row, `Move Draft` unless stated, so a list of handles
 *   is not a list of identical names. It states the kit's role description over dnd-kit's English
 *   "draggable" and is described by the root's instructions. Space or Enter lifts the row, and a
 *   pointer on the handle drags it. It takes `touch-action: none`, so a finger on it drags the row
 *   and the page does not scroll. A disabled row renders an inert empty box of the handle's size in
 *   its place, so its content starts where the other rows' does. dnd-kit writes a `button` role and
 *   a tab stop on each row's handle, or on the row's `li` where it has none, so the box registers
 *   as the disabled row's handle and its `inert` keeps both out of the tab order and the
 *   accessibility tree.
 */

import { type ReactElement } from "react";

import { Button, type ButtonProps } from "@stealthscale/component-actions";

import { withContext } from "#sortable/context.ts";
import { useItemState, useRootState } from "#sortable/state.ts";

/**
 * Renders the actions `Button` with the recipe's handle class.
 */
const Control = withContext(Button, "handle");

/**
 * Renders the empty box a fixed row keeps in the handle's place, with the recipe's fixed class.
 */
const Fixed = withContext("span", "fixed");

/**
 * Describes the props of the handle: the props of the actions `Button`, whose children are the
 * glyph.
 */
export type HandleProps = Omit<ButtonProps, "aria-label" | "shape">;

/**
 * Renders the handle of the row it is in, or an inert empty box of its size for a disabled row.
 *
 * @param props - The props of the actions `Button`, whose children are the glyph.
 */
export function Handle(props: HandleProps): ReactElement {
  const { disabled, handleRef, label } = useItemState();
  const { instructionsId, words } = useRootState();

  if (disabled) return <Fixed inert ref={handleRef} />;

  return (
    <Control
      aria-describedby={instructionsId}
      aria-label={words.handleLabel(label)}
      aria-roledescription={words.roleDescription}
      ref={handleRef}
      shape="square"
      size="xs"
      variant="ghost"
      {...props}
    />
  );
}
