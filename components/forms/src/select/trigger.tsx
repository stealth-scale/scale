/**
 * Renders the button that shows the value and opens the panel.
 *
 * @remarks
 *   The element is a `button` with `role="combobox"`, which a screen reader announces with its
 *   name, its value and whether the panel is open. It is named by `Select.Label` while one is
 *   mounted, else by the label of a field around the select, else by the caller's `aria-label`,
 *   which it reports to the root for the panel. Inside a field it is described by the field's
 *   helper and error texts. The arrow keys, Enter and Space open the panel, and on a single select
 *   that is closed the arrow keys, Home, End and typed letters change the value without opening
 *   it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { omitUndefined } from "@stealthscale/hooks";

import { withContext } from "#select/context.ts";
import { useSelect } from "#select/machine.ts";
import { useNamed, useShared } from "#select/state.ts";

/**
 * Renders the `button` with the select's trigger class.
 */
const Pressed = withContext("button", "trigger");

/**
 * Describes the props of the trigger: the props of a `button`.
 */
export type TriggerProps = ComponentProps<typeof Pressed>;

/**
 * Renders the trigger with the machine's trigger props, named and described as the root shares,
 * and reports the caller's `aria-label` to the root.
 *
 * @param props - The props of a `button`.
 * @returns The `button` element with `role="combobox"`.
 */
export function Trigger(props: TriggerProps): ReactElement {
  const api = useSelect();
  const { describedBy, label } = useShared();

  useNamed(props["aria-label"]);

  const { "aria-labelledby": _labelledBy, ...machine } = api.getTriggerProps();
  const named = omitUndefined({ "aria-describedby": describedBy, "aria-labelledby": label });

  return <Pressed {...mergeProps(machine, named, props)} />;
}
