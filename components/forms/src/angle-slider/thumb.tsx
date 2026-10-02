/**
 * Renders the thumb of an angle slider: the control a person turns around the dial and moves with
 * the keys.
 *
 * @remarks
 *   The element is a `div` in the `slider` role, in the tab order, with the value and its bounds as
 *   ARIA values. The maximum is 359, the value End sets. The keys follow the slider pattern of the
 *   ARIA Authoring Practices, which the machine's own map breaks on ArrowUp: ArrowRight and ArrowUp
 *   step the value up, ArrowLeft and ArrowDown step it down, PageUp, PageDown and an arrow with
 *   Shift step it tenfold, and Home and End set the bounds. The thumb is named after the dial's
 *   label, a field's label or a fieldset's legend, and its own `label` adds words to that name or
 *   names it alone. Its `aria-valuetext` is the value in the root's format. A disabled thumb sets
 *   `aria-disabled`, and a read-only thumb dashes its edge and refuses every key. The part
 *   leaves out the machine's inline `rotate`, which reads `--angle`, and the recipe turns it by the
 *   root's `--value`.
 */

import { type ComponentProps, type KeyboardEvent, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { omitUndefined } from "@stealthscale/hooks";

import { withContext } from "#angle-slider/context.ts";
import { keyEvent } from "#angle-slider/keys.ts";
import { useAngleSlider } from "#angle-slider/machine.ts";
import { useShared } from "#angle-slider/state.ts";
import { naming } from "#slider/naming.ts";

/**
 * Renders the `div` with the angle slider's thumb class.
 */
const Knob = withContext("div", "thumb");

/**
 * Largest value the machine sets, which End moves the thumb to.
 */
const MAXIMUM = 359;

/**
 * Describes the props of the thumb: its words and the props of a `div`.
 */
export interface ThumbProps extends Omit<ComponentProps<typeof Knob>, "aria-label"> {
  /**
   * Words that name the thumb, after the dial's label where one names it.
   */
  readonly label?: string | undefined;
}

/**
 * Renders the thumb with the machine's props, its name, its value text and its keys.
 *
 * @param props - The words and the props of the `div`, merged over the machine's.
 * @returns The `div` element.
 */
export function Thumb({ label, ...rest }: ThumbProps): ReactElement {
  const api = useAngleSlider();
  const {
    described,
    dir,
    disabled,
    format,
    interactive,
    label: group,
    send,
    step,
    thumbId,
  } = useShared();
  const {
    "aria-labelledby": _named,
    onKeyDown: _keys,
    style: _turned,
    ...machine
  } = api.getThumbProps();

  /**
   * Sends the machine the event for a key the slider pattern maps, and keeps the page from
   * scrolling for it.
   */
  const pressed = (event: KeyboardEvent<HTMLDivElement>): void => {
    const sent = keyEvent(event, step, dir);

    if (event.defaultPrevented || !interactive || sent === undefined) return;

    event.preventDefault();
    send(sent);
  };

  return (
    <Knob
      {...mergeProps(
        machine,
        naming(label, group, thumbId),
        omitUndefined({
          "aria-describedby": described,
          "aria-disabled": disabled ? "true" : undefined,
        }),
        { "aria-valuemax": MAXIMUM, "aria-valuetext": format(api.value), onKeyDown: pressed },
        rest,
      )}
    />
  );
}
