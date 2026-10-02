/**
 * Renders one thumb of a slider: the control a person drags and moves with the keys.
 *
 * @remarks
 *   The element is a `div` in the `slider` role, in the tab order, with the value, the minimum and
 *   the maximum as ARIA values. The part renders the hidden `input` a form submits for its position
 *   after it, not inside it, because an element in the `slider` role must not contain a control.
 *   The arrow keys step the value, PageUp and PageDown step it tenfold, and Home and End set its
 *   bounds. It is named after the slider's label, a field's label or a fieldset's legend. In a
 *   range each thumb also takes its own `label`, so the name reads "Price Minimum". Its
 *   `aria-valuetext` is the formatted value while the root states `formatOptions`, and the root's
 *   `getAriaValueText` replaces it. A read-only thumb dashes its edge. Children render inside it,
 *   such as a glyph or `Slider.DraggingIndicator`.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { omitUndefined } from "@stealthscale/hooks";

import { withContext } from "#slider/context.ts";
import { useSlider } from "#slider/machine.ts";
import { naming } from "#slider/naming.ts";
import { ThumbProvider, useShared } from "#slider/state.ts";

/**
 * Renders the `div` with the slider's thumb class.
 */
const Handle = withContext("div", "thumb");

/**
 * Describes the props of a thumb: its position, its name in a range, the name its value is
 * submitted under, and the props of a `div`.
 */
export interface ThumbProps extends Omit<ComponentProps<typeof Handle>, "aria-label"> {
  /**
   * Position of the thumb, from zero. Defaults to 0.
   */
  readonly index?: number | undefined;

  /**
   * Words that name this thumb among the others, such as `Minimum`.
   */
  readonly label?: string | undefined;

  /**
   * Name the hidden input submits this thumb's value under. Defaults to the root's `name`.
   */
  readonly name?: string | undefined;
}

/**
 * Renders the thumb with the machine's props, its name, its value text and its hidden input.
 *
 * @param props - The position, the words, the input's name and the props of the `div`, merged
 *   over the machine's.
 * @returns The `div` element.
 */
export function Thumb({ children, index = 0, label, name, ...rest }: ThumbProps): ReactElement {
  const api = useSlider();
  const { described, format, formatted, label: group, readOnly, thumbId } = useShared();
  const thumb = { index, ...omitUndefined({ name }) };
  const { "aria-labelledby": _machine, ...machine } = api.getThumbProps(thumb);
  const valued = formatted ? { "aria-valuetext": format(api.getThumbValue(index)) } : {};

  return (
    <ThumbProvider value={index}>
      <Handle
        {...mergeProps(
          valued,
          machine,
          naming(label, group, thumbId(index)),
          omitUndefined({ "aria-describedby": described, "data-readonly": readOnly || undefined }),
          rest,
        )}
      >
        {children}
      </Handle>
      <input {...api.getHiddenInputProps(thumb)} />
    </ThumbProvider>
  );
}
