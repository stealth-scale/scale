/**
 * Reads what a slot contains for the current page, before anything renders.
 */

import { type ResolvedExtension, type SlotReference } from "@stealthscale/sdk-core";

import { type PageContribution } from "#host/stores.ts";
import { type Dropped } from "#slots/dropped.ts";
import { useContributions, usePlan } from "#slots/use-plan.ts";

/**
 * Describes what a slot contains for the current page.
 */
export interface SlotContents {
  /**
   * Content the pages on screen contribute to the slot with `Into`, in order.
   */
  readonly contributions: readonly PageContribution[];

  /**
   * The extensions placed in the slot that it does not render, each with its reason.
   */
  readonly dropped: readonly Dropped[];

  /**
   * True where an extension or a page contribution renders in the slot.
   */
  readonly filled: boolean;

  /**
   * The extensions the slot renders, in order.
   */
  readonly rendered: readonly ResolvedExtension[];
}

/**
 * Returns what a slot contains for the current page, so a frame leaves out the region of an empty
 * slot.
 *
 * @remarks
 *   A keyed slot contains the extensions for `match`. The reader has no record, so an extension's
 *   condition on the slot's record reads as false here.
 */
export function useSlot(slot: SlotReference, match?: string): SlotContents {
  const { plan } = usePlan("useSlot", slot.id, match);
  const contributions = useContributions("useSlot", slot.id);

  return {
    contributions,
    dropped: plan.dropped,
    filled: plan.rendered.length > 0 || contributions.length > 0,
    rendered: plan.rendered,
  };
}
