/**
 * Provides the state the parts share beside the machine.
 *
 * @remarks
 *   The group names itself after `TagsInput.Label` only while a label is mounted, because an ID
 *   reference to an element that does not exist is invalid. The machine's api reports neither the
 *   size nor the read-only state, so the root provides the values it resolved from its props, the
 *   field and the fieldset. An item provides its tag to the preview, the text, the delete trigger
 *   and the item input inside it.
 */

import { type ItemProps } from "@zag-js/tags-input";

import { createLabelling, createRequiredContext } from "@stealthscale/hooks";

/**
 * Provides the setter the label reports its mounting through, and the hook the label calls.
 *
 * @remarks
 *   `useLabelled` throws for a label rendered outside a root.
 */
export const [LabellingProvider, useLabelled] = createLabelling("TagsInput");

/**
 * Size of a tags input, and of the tags inside it.
 */
export type Size = "lg" | "md" | "sm";

/**
 * Describes the state the root shares with the parts.
 */
export interface Shared {
  /**
   * Whether the tags input is disabled.
   */
  readonly disabled: boolean;

  /**
   * Whether the tags are read-only, so no part offers to add, edit or remove one.
   */
  readonly readOnly: boolean;

  /**
   * Size of the tags input, which each tag takes.
   */
  readonly size: Size;
}

/**
 * Provides the shared state, and reads it back.
 *
 * @remarks
 *   `useShared` throws for a part rendered outside a root.
 */
export const [SharedProvider, useShared] = createRequiredContext<Shared>("TagsInput");

/**
 * Describes the tag an item renders: its position, its value and whether it is disabled.
 */
export type Tagged = ItemProps;

/**
 * Provides an item's tag to the parts inside the item, and reads it back.
 *
 * @remarks
 *   `useItem` throws for an item part rendered outside `TagsInput.Item`.
 */
export const [ItemProvider, useItem] = createRequiredContext<Tagged>("TagsInput.Item");
