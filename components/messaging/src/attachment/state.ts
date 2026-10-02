/**
 * Provides a group's size and orientation to the attachments inside it, and tells an attachment
 * that it is an item of a list.
 */

import { createRequiredContext } from "@stealthscale/hooks";

/**
 * Describes what a group provides: the size and the orientation its attachments default to.
 */
export interface GroupDefaults {
  /**
   * Orientation the attachments take unless they state one.
   */
  readonly orientation?: "horizontal" | "vertical" | undefined;

  /**
   * Size the attachments take unless they state one.
   */
  readonly size?: "md" | "sm" | "xs" | undefined;
}

/**
 * Provides a group's defaults, and reads them where an attachment renders, undefined outside a
 * group.
 */
export const [GroupProvider, , useGroupDefaults] =
  createRequiredContext<GroupDefaults>("Attachment.Group");
