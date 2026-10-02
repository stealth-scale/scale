/**
 * Renders the button that moves to the next page.
 *
 * @remarks
 *   The element is the library's square `Button`, or its `a` for links, named "Next page" unless
 *   the caller passes another `label`. The caller passes the glyph as children. On the last page
 *   the trigger sets `aria-disabled` and keeps focus.
 */

import { type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { type ButtonProps } from "@stealthscale/component-actions";

import { TriggerButton, TriggerLink } from "#pagination/bound.ts";
import { ended } from "#pagination/ended.ts";
import { usePagination } from "#pagination/machine.ts";

/**
 * Describes the props of the next trigger: its accessible name and the props of a `Button`.
 */
export interface NextTriggerProps extends ButtonProps {
  /**
   * Accessible name of the trigger, "Next page" unless the caller passes another.
   */
  readonly label?: string | undefined;
}

/**
 * Renders the next trigger with the machine's props merged over the caller's.
 *
 * @param props - The trigger's name and the props of a `Button`.
 * @returns The `button` element, or an `a` for links.
 */
export function NextTrigger({ label = "Next page", ...rest }: NextTriggerProps): ReactElement {
  const { api, type } = usePagination();
  const Pressed = type === "link" ? TriggerLink : TriggerButton;
  const props = ended(api.getNextTriggerProps(), api.page >= api.totalPages, type);

  return <Pressed {...mergeProps(props, rest)} aria-label={label} shape="square" />;
}
