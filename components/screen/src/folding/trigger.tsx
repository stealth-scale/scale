/**
 * Renders the control that opens a row's menu of folded actions.
 *
 * @remarks
 *   The control is the menu's trigger rendered as the library's button, so it has the look and the
 *   size of the row's other actions. With a mark it is a square button named by the words, and
 *   without one it shows the words. A toolbar renders it as a roving item, which gives it the row's
 *   arrow keys.
 */

import { type ComponentProps, type ReactElement, type ReactNode } from "react";

import { Button } from "@stealthscale/component-actions";
import { Menu } from "@stealthscale/component-disclosure";
import { type Scale } from "@stealthscale/theme/authoring";

/**
 * Describes the props of the trigger: its words, its mark, its look and the props of the menu's
 * trigger.
 */
export interface TriggerProps extends Omit<ComponentProps<typeof Menu.Trigger>, "children"> {
  /**
   * Mark the trigger shows in place of its words.
   */
  readonly icon?: ReactNode | undefined;

  /**
   * Words that name the menu, such as `More actions`.
   */
  readonly label: string;

  /**
   * Size of the button, which is the size of the row's actions.
   */
  readonly size: Scale;

  /**
   * Look of the button, which is the look of the row's actions.
   */
  readonly variant: "ghost" | "outline";
}

/**
 * Renders the menu's trigger as a button with the mark or the words.
 *
 * @param props - The words, the mark, the look and the props of the menu's trigger.
 * @returns The `button` element with the menu's trigger props.
 */
export function Trigger({ icon, label, size, variant, ...rest }: TriggerProps): ReactElement {
  const content =
    icon === undefined
      ? { children: label }
      : { "aria-label": label, children: icon, shape: "square" };

  return <Menu.Trigger as={Button} {...rest} {...{ size, variant, ...content }} />;
}
