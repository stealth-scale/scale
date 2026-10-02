/**
 * Provides the state the parts share beside the machine.
 *
 * @remarks
 *   The group names itself after `FileUpload.Label` only while a label is mounted, because an ID
 *   reference to an element that does not exist is invalid. The machine's api reports neither the
 *   size nor the read-only state the root resolved from its props, the field and the fieldset, so
 *   the root provides them. An item group provides which list it renders, and an item provides its
 *   file to the parts inside it.
 */

import { createLabelling, createRequiredContext } from "@stealthscale/hooks";

import { type ItemType } from "#file-upload/machine.ts";

/**
 * Provides the setter the label reports its mounting through, and the hook the label calls.
 *
 * @remarks
 *   `useLabelled` throws for a label rendered outside a root.
 */
export const [LabellingProvider, useLabelled] = createLabelling("FileUpload");

/**
 * Size of a file upload.
 */
export type Size = "lg" | "md" | "sm";

/**
 * Describes the state the root shares with the parts.
 */
export interface Shared {
  /**
   * Whether the upload is disabled.
   */
  readonly disabled: boolean;

  /**
   * Locale the upload formats a file's size in.
   */
  readonly locale: string;

  /**
   * Whether the files are read-only, so no part offers to add or remove one.
   */
  readonly readOnly: boolean;

  /**
   * Size of the upload.
   */
  readonly size: Size;
}

/**
 * Provides the shared state, and reads it back.
 *
 * @remarks
 *   `useShared` throws for a part rendered outside a root.
 */
export const [SharedProvider, useShared] = createRequiredContext<Shared>("FileUpload");

/**
 * Provides the list an item group renders to its items, and reads it back.
 *
 * @remarks
 *   `useListed` throws for an item rendered outside `FileUpload.ItemGroup`, because a list item
 *   belongs in a list.
 */
export const [ListedProvider, useListed] = createRequiredContext<ItemType>("FileUpload.ItemGroup");

/**
 * Describes the file an item renders and the list it belongs to.
 */
export interface Filed {
  /**
   * The file.
   */
  readonly file: File;

  /**
   * The list the file is in: the accepted files or the refused ones.
   */
  readonly type: ItemType;
}

/**
 * Provides an item's file to the parts inside the item, and reads it back.
 *
 * @remarks
 *   `useItem` throws for an item part rendered outside `FileUpload.Item`.
 */
export const [ItemProvider, useItem] = createRequiredContext<Filed>("FileUpload.Item");
