/**
 * Renders the box a person draws a signature in.
 *
 * @remarks
 *   The element is a `div` in the `application` role with the machine's `aria-roledescription`, in
 *   the tab order while the pad is enabled. A primary pointer draws a stroke, and a press on a
 *   button inside it keeps its own behaviour. No key draws: a signature is input that depends on
 *   the pointer's path, which WCAG 2.1.1 exempts from keyboard operation. The control is named by
 *   the pad's label or a field's label, described by a field's texts, and carries the invalid and
 *   read-only states the recipe reads. The machine's name, `signature pad`, and its inline layout
 *   styles are left out: the label names the control, and the recipe places it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { omitUndefined } from "@stealthscale/hooks";

import { withContext } from "#signature-pad/context.ts";
import { useSignaturePad } from "#signature-pad/machine.ts";
import { useShared } from "#signature-pad/state.ts";

/**
 * Renders the control `div` with the signature pad's control class.
 */
const Drawn = withContext("div", "control");

/**
 * Describes the props of the control: the props of a `div`.
 */
export type ControlProps = ComponentProps<typeof Drawn>;

/**
 * Renders the control with the machine's props, the pad's names and its states.
 *
 * @param props - Attributes and children of the `div` element, merged over the machine's.
 * @returns The `div` element in the `application` role.
 */
export function Control(props: ControlProps): ReactElement {
  const api = useSignaturePad();
  const { described, invalid, readOnly } = useShared();
  const { "aria-label": _name, style: _style, ...control } = api.getControlProps();

  return (
    <Drawn
      {...mergeProps(
        control,
        described,
        omitUndefined({
          "aria-invalid": invalid ? "true" : undefined,
          "data-readonly": readOnly ? "" : undefined,
        }),
        props,
      )}
    />
  );
}
