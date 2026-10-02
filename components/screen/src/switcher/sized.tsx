/**
 * Renders the menu at the switcher's size.
 *
 * @remarks
 *   The binding keeps the switcher's variants for its own parts and passes none of them to the
 *   menu, so the size reaches the menu as `step` and this component passes it as `size`.
 */

import { type ComponentProps, type ReactElement } from "react";

import { Menu } from "@stealthscale/component-disclosure";

/**
 * Selects one of the sizes the menu renders at, which are the switcher's sizes.
 */
export type Step = "lg" | "md" | "sm";

/**
 * Describes the props of `Sized`: the menu's props and the step.
 */
export interface SizedProps extends Omit<ComponentProps<typeof Menu.Root>, "size"> {
  /**
   * Size the switcher renders at.
   */
  readonly step: Step;
}

/**
 * Renders the menu at the step.
 *
 * @param props - The step and the menu's props.
 * @returns The menu at that size.
 */
export function Sized({ step, ...rest }: SizedProps): ReactElement {
  return <Menu.Root {...rest} size={step} />;
}
