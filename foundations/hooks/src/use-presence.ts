/**
 * Keeps an element in the document while its exit animation runs, and reports whether to render it.
 *
 * @remarks
 *   The hook runs `@zag-js/presence`. When `present` turns false, the machine reads the element's
 *   computed `animationName` one frame later. An element with no animation, a `0s` duration or
 *   `display: none` leaves at once, and an element with an animation stays until its `animationend`
 *   or `animationcancel`. In a hidden document the element leaves at once.
 */

import { type RefCallback, useState } from "react";

import * as presence from "@zag-js/presence";
import { normalizeProps, useMachine } from "@zag-js/react";

import { omitUndefined } from "#omit-undefined.ts";

/**
 * Describes when an element shows and whether it renders while it does not.
 */
export interface PresenceOptions {
  /**
   * Renders nothing until the element first shows.
   */
  readonly lazyMount?: boolean | undefined;

  /**
   * Runs once the element's exit animation ends.
   */
  readonly onExitComplete?: (() => void) | undefined;

  /**
   * True while the element shows.
   */
  readonly present: boolean;

  /**
   * Leaves `data-state` unset until `present` first changes, so an element that shows on mount
   * plays no entry animation.
   */
  readonly skipAnimationOnMount?: boolean | undefined;

  /**
   * Renders nothing once the element's exit animation ends.
   */
  readonly unmountOnExit?: boolean | undefined;
}

/**
 * Describes the props the element spreads: the state its recipe animates and whether it is hidden.
 */
export interface PresenceProps {
  /**
   * `open` while `present` is true and `closed` after, which the recipe's entry and exit animations
   * read.
   */
  readonly "data-state"?: "closed" | "open";

  /**
   * True once the element has no exit animation left to run.
   */
  readonly hidden: boolean;

  /**
   * True while the exit animation runs, so the leaving element takes no focus and no pointer input.
   */
  readonly inert?: boolean;
}

/**
 * Describes what the hook returns.
 */
export interface Presence {
  /**
   * True while the element shows or runs its exit animation.
   */
  readonly present: boolean;

  /**
   * Props the element spreads.
   */
  readonly props: PresenceProps;

  /**
   * Ref callback that attaches the element whose animations the machine reads.
   */
  readonly setNode: RefCallback<HTMLElement>;

  /**
   * True while the component renders nothing: before the element first shows under `lazyMount`,
   * and after its exit under `unmountOnExit`.
   */
  readonly unmounted: boolean;
}

/**
 * Returns the element's props: `hidden` once it has left, `inert` while it leaves, and
 * `data-state` unless the entry animation is skipped.
 *
 * @remarks
 *   A machine can move focus into the element one frame after it closes: the menu focuses its
 *   panel a frame after a highlight, and Escape in that frame returns focus to the trigger first.
 *   The panel is inert while it leaves, so that focus call does nothing.
 * @param skipped - Whether the entry animation on mount is skipped.
 * @param present - Whether the element shows.
 * @param shown - Whether the element shows or runs its exit animation.
 */
function propsOf(skipped: boolean, present: boolean, shown: boolean): PresenceProps {
  const leaving = !present && shown ? { inert: true } : {};

  if (skipped) return { ...leaving, hidden: !shown };

  return { ...leaving, "data-state": present ? "open" : "closed", hidden: !shown };
}

/**
 * Runs the presence machine for one element and returns its props, its ref callback and whether
 * to render it.
 *
 * @param options - Whether the element shows, and whether it renders while it does not.
 */
export function usePresence(options: PresenceOptions): Presence {
  const { onExitComplete, present } = options;
  const service = useMachine(presence.machine, omitUndefined({ onExitComplete, present }));
  const api = presence.connect(service, normalizeProps);
  const [shown, setShown] = useState(api.present);

  if (api.present && !shown) setShown(true);

  return {
    present: api.present,
    props: propsOf(api.skip && options.skipAnimationOnMount === true, present, api.present),
    setNode: api.setNode,
    unmounted: !api.present && (shown ? options.unmountOnExit : options.lazyMount) === true,
  };
}
