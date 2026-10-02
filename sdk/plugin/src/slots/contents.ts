/**
 * Decides which of the extensions placed in a slot render, and why each of the others does not.
 *
 * @remarks
 *   The decision is pure, so `Slot`, `useSlot` and the extension statuses decide alike. A keyed
 *   slot compares the value first, so an extension for another value never evaluates its condition
 *   and an experiment in it counts no exposure.
 */

import { type ResolvedExtension, type ResolvedSlot, type When } from "@stealthscale/sdk-core";

import { type RenderTarget } from "#host/report.ts";
import { type Dropped, type UnplacedReason } from "#slots/dropped.ts";

/**
 * Describes the extensions a slot renders and the ones it drops.
 */
export interface Contents {
  /**
   * The extensions the slot does not render, each with its reason.
   */
  readonly dropped: readonly Dropped[];

  /**
   * The extensions the slot renders, in order.
   */
  readonly rendered: readonly ResolvedExtension[];
}

/**
 * Lists the lookups a slot decides with.
 */
export interface Judge {
  /**
   * Returns true where a condition is true for the session, the page and the slot's record.
   */
  readonly isMet: (when: undefined | When) => boolean;

  /**
   * Returns true where a plugin is on.
   */
  readonly isOn: (pluginId: string) => boolean;

  /**
   * Returns true where a target is quarantined.
   */
  readonly isQuarantined: (target: RenderTarget) => boolean;
}

/**
 * Returns why an extension does not render, wherever it is placed, or undefined where it renders.
 */
export function reasonOf(extension: ResolvedExtension, judge: Judge): undefined | UnplacedReason {
  if (!judge.isOn(extension.plugin)) return "off";

  if (judge.isQuarantined(`extension:${extension.id}`)) return "quarantined";

  return judge.isMet(extension.when) ? undefined : "condition";
}

/**
 * Returns the extensions a slot renders, and the ones it drops with their reasons.
 *
 * @remarks
 *   A keyed slot keeps the extensions for its value. A slot of arity one keeps the first extension
 *   left. Where several `replace` extensions are left, the last renders in place of the slot's own
 *   content.
 * @param placed - The extensions placed in the slot, in order.
 * @param slot - The slot as the build resolved it.
 * @param match - The value a keyed slot renders with.
 * @param judge - The lookups the conditions, the plugins and the quarantine are read through.
 */
export function contentsOf(
  placed: readonly ResolvedExtension[],
  slot: ResolvedSlot,
  match: string | undefined,
  judge: Judge,
): Contents {
  const dropped: Dropped[] = [];
  const kept: ResolvedExtension[] = [];

  for (const extension of placed) {
    const reason =
      slot.keyed === true && extension.match !== match ? "match" : reasonOf(extension, judge);

    if (reason === undefined) kept.push(extension);
    else dropped.push({ extension, reason });
  }

  const fitted = slot.arity === "one" ? kept.slice(0, 1) : kept;
  const last = fitted.findLast((one) => one.position === "replace");

  for (const extension of kept.slice(fitted.length)) dropped.push({ extension, reason: "full" });

  for (const extension of fitted) {
    if (extension.position === "replace" && extension !== last) {
      dropped.push({ extension, reason: "replaced" });
    }
  }

  return {
    dropped,
    rendered: fitted.filter((one) => one.position !== "replace" || one === last),
  };
}

/**
 * Returns the extensions attached to a target that render, and the ones that do not with their
 * reasons: the target's decorators, or the wrappers of every member of a kind.
 *
 * @param key - The target's key: `extension:<id>` or `every:<kind>`.
 * @param extensions - Every extension of the product, in install order.
 * @param judge - The lookups the conditions, the plugins and the quarantine are read through.
 */
export function attachedTo(
  key: string,
  extensions: readonly ResolvedExtension[],
  judge: Judge,
): Contents {
  const dropped: Dropped[] = [];
  const rendered: ResolvedExtension[] = [];

  for (const extension of extensions) {
    if (extension.target !== key || extension.disabled) continue;

    const reason = reasonOf(extension, judge);

    if (reason === undefined) rendered.push(extension);
    else dropped.push({ extension, reason });
  }

  return { dropped, rendered };
}
