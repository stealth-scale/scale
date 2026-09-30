/**
 * Renders the link that opens the hover card while a pointer rests on it or it has keyboard focus.
 *
 * @remarks
 *   The element is an `a`, which a keyboard focuses once it has an `href`. The machine sets no ARIA
 *   attribute on it, because the card previews what the link leads to and the link opens that page
 *   itself. More than one trigger can share a card. Each passes its own `value`, the root
 *   reports the value of the trigger that opened the card as `triggerValue`, and the machine places
 *   the card against that trigger. The machine ignores a touch pointer's enter and leave events and
 *   opens the card on any focus. A tap focuses the link in Chromium and Firefox, so the trigger
 *   passes no focus to the machine after a touch press until the link loses focus.
 */

import { type ComponentProps, type PointerEvent, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#hover-card/context.ts";
import { useHoverCard } from "#hover-card/machine.ts";

/**
 * Renders the `a` with the hover card's trigger class.
 */
const Drawn = withContext("a", "trigger");

/**
 * Contains each link whose last press was a touch, until the link loses focus.
 */
const tapped = new WeakSet<Element>();

/**
 * Describes the props of the trigger: the props of an `a`, and the value that tells this trigger
 * apart from the card's other triggers.
 */
export interface TriggerProps extends ComponentProps<typeof Drawn> {
  /**
   * The value the root reports as `triggerValue` while this trigger opened the card. Absent for a
   * card with one trigger.
   */
  readonly value?: string | undefined;
}

/**
 * Records whether the press that can focus a link is a touch.
 */
function pressed({ currentTarget, pointerType }: PointerEvent): void {
  if (pointerType === "touch") tapped.add(currentTarget);
  else tapped.delete(currentTarget);
}

/**
 * Renders the trigger with the machine's trigger props merged over the caller's.
 *
 * @param props - The value and the props of an `a`.
 * @returns The `a` element.
 */
export function Trigger({ value, ...props }: TriggerProps): ReactElement {
  const api = useHoverCard();
  const { onBlur, onFocus, ...machine }: TriggerProps = {
    ...api.getTriggerProps(value === undefined ? {} : { value }),
  };
  const guarded: TriggerProps = {
    /**
     * Forgets the touch press and passes the blur to the machine.
     */
    onBlur(event) {
      tapped.delete(event.currentTarget);
      onBlur?.(event);
    },

    /**
     * Passes the focus to the machine unless a touch press gave it.
     */
    onFocus(event) {
      if (!tapped.has(event.currentTarget)) onFocus?.(event);
    },

    onPointerDown: pressed,
  };

  return <Drawn {...mergeProps(machine, guarded, props)} />;
}
