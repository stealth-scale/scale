/**
 * Renders the button that moves to the first page.
 *
 * @remarks
 *   The element is the library's square `Button`, or its `a` for links, named "First page" unless
 *   the caller passes another `label`. The caller passes the glyph as children. On the first page
 *   the trigger sets `aria-disabled` and keeps focus.
 */

import { type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { type ButtonProps } from "@stealthscale/component-actions";

import { TriggerButton, TriggerLink } from "#pagination/bound.ts";
import { ended } from "#pagination/ended.ts";
import { usePagination } from "#pagination/machine.ts";

/**
 * Describes the props of the first trigger: its accessible name and the props of a `Button`.
 */
export interface FirstTriggerProps extends ButtonProps {
  /**
   * Accessible name of the trigger, "First page" unless the caller passes another.
   */
  readonly label?: string | undefined;
}

/**
 * Renders the first trigger with the machine's props merged over the caller's.
 *
 * @param props - The trigger's name and the props of a `Button`.
 * @returns The `button` element, or an `a` for links.
 */
export function FirstTrigger({ label = "First page", ...rest }: FirstTriggerProps): ReactElement {
  const { api, type } = usePagination();
  const Pressed = type === "link" ? TriggerLink : TriggerButton;
  const props = ended(api.getFirstTriggerProps(), api.page <= 1, type);

  return <Pressed {...mergeProps(props, rest)} aria-label={label} shape="square" />;
}
