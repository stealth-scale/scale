/**
 * Renders the control that shows the current workspace and opens the menu.
 *
 * @remarks
 *   The trigger renders `label` as visually hidden text at its start, so a screen reader announces
 *   `Workspace Acme` and the reader knows what the control switches. The label is text content and
 *   not an `aria-label`, because an `aria-label` replaces the visible name and speech input matches
 *   the visible name (WCAG 2.5.3). The trigger writes `data-iconic` in a sidebar closed to a rail
 *   and `data-narrow` in a narrow toolbar, which the recipe reads to hide the words visually. The
 *   mark is the caller's, and a switcher without one shows the name over the detail.
 */

import { type ComponentProps, type ReactElement } from "react";

import { VisuallyHidden } from "@stealthscale/component-a11y";
import { Menu } from "@stealthscale/component-disclosure";

import { withContext } from "#switcher/context.ts";
import { useSwitcher } from "#switcher/state.ts";

/**
 * Renders the menu's trigger with the root slot's class.
 */
const Pressed = withContext(Menu.Trigger, "root");

/**
 * Describes the props of `Trigger`.
 */
export interface TriggerProps extends ComponentProps<typeof Pressed> {
  /**
   * Kind of thing the control switches: `Workspace`, `Project`, `Environment`. A screen reader
   * announces it before the current name.
   */
  readonly label: string;
}

/**
 * Renders the control with its label before its children.
 *
 * @param props - `label` and the menu trigger's props.
 * @returns The menu's trigger with the hidden label before the children.
 */
export function Trigger({ children, label, ...rest }: TriggerProps): ReactElement {
  const { iconic, narrow } = useSwitcher();

  return (
    <Pressed {...rest} data-iconic={iconic ? "" : undefined} data-narrow={narrow ? "" : undefined}>
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </Pressed>
  );
}
