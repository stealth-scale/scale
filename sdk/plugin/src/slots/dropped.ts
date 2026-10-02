/**
 * Declares why a slot does not render an extension placed in it.
 */

import { type ResolvedExtension } from "@stealthscale/sdk-core";

/**
 * Lists why an extension is not on the page: its plugin is not on, it is quarantined, its condition
 * is false, its keyed slot rendered another value, its slot renders one and another came first, a
 * later `replace` renders in its place, a placement moved it, or its slot is not mounted.
 */
export type UnplacedReason =
  | "condition"
  | "full"
  | "match"
  | "moved"
  | "off"
  | "quarantined"
  | "replaced"
  | "unmounted";

/**
 * Describes an extension a slot does not render, and why.
 */
export interface Dropped {
  /**
   * The extension.
   */
  readonly extension: ResolvedExtension;

  /**
   * Why the slot does not render it.
   */
  readonly reason: UnplacedReason;
}
