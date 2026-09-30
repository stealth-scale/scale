/**
 * Renders the pointer's control that closes a closable tab.
 *
 * @remarks
 *   The control is a `span` inside the tab's `button`, because a button inside a button is invalid
 *   HTML. It is hidden from assistive technology: a person on a keyboard or a screen reader closes
 *   the focused tab with Delete, which the tab states in `aria-keyshortcuts`. A press on it neither
 *   focuses nor selects its tab. It renders the caller's glyph.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#tabs/context.ts";
import { useTabsActions } from "#tabs/machine.ts";

/**
 * Renders the `span` with the tabs' close trigger class.
 */
const Glyph = withContext("span", "closeTrigger");

/**
 * Describes the props of the close trigger: its title and the props of a `span`.
 */
export interface CloseTriggerProps extends ComponentProps<typeof Glyph> {
  /**
   * Title a pointer shows over the control. Defaults to "Close".
   */
  readonly label?: string | undefined;
}

/**
 * Describes the props the close trigger sets on its `span`.
 */
type ClosingProps = Pick<
  ComponentProps<"span">,
  "aria-hidden" | "onClick" | "onMouseDown" | "title"
>;

/**
 * Renders the close trigger inside a tab.
 *
 * @param props - The title and the props of a `span`.
 * @returns The `span` element.
 */
export function CloseTrigger({ label = "Close", ...rest }: CloseTriggerProps): ReactElement {
  const { close } = useTabsActions();
  const own: ClosingProps = {
    "aria-hidden": true,
    onClick: (event) => {
      event.preventDefault();
      event.stopPropagation();

      const tab = event.currentTarget.closest<HTMLElement>("[role=tab]");

      if (tab !== null) close(tab);
    },
    onMouseDown: (event) => {
      event.preventDefault();
    },
    title: label,
  };

  return <Glyph {...mergeProps(own, rest)} />;
}
