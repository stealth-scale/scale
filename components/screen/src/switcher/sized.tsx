/**
 * Draws the menu at the step the switcher was asked for.
 *
 * @remarks
 *   The binding over the menu keeps the switcher's variants for its own parts and hands the menu
 *   nothing of them, so the step reaches the menu under another name and is put back here.
 */

import { type ComponentProps, type ReactElement } from "react";

import { Menu } from "@stealthscale/component-disclosure";

/**
 * The steps the menu is drawn at, which are the switcher's own.
 */
export type Step = "lg" | "md" | "sm";

/**
 * Describes what the menu takes from the switcher: everything the menu takes, and the step under
 * a name the binding does not strip.
 */
export interface SizedProps extends Omit<ComponentProps<typeof Menu.Root>, "size"> {
  /**
   * The step the switcher was asked for.
   */
  readonly step: Step;
}

/**
 * Draws the menu at the step.
 *
 * @param props - The step, and whatever the menu takes.
 * @returns The menu, at the step.
 */
export function Sized({ step, ...rest }: SizedProps): ReactElement {
  return <Menu.Root {...rest} size={step} />;
}
