/**
 * Renders the region a right-click, a long press or Shift+F10 opens the menu over.
 *
 * @remarks
 *   The machine opens the menu at the pointer's position, handles the long press, and prevents the
 *   browser's own context menu.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#menu/context.ts";
import { useMenu } from "#menu/machine.ts";

/**
 * Renders the `div` with the menu's context trigger class.
 */
const Held = withContext("div", "contextTrigger");

/**
 * Describes the props of the context trigger: its value and the props of a `div`.
 */
export interface ContextTriggerProps extends ComponentProps<typeof Held> {
  /**
   * Value that identifies the region, for a menu opened from several.
   */
  readonly value?: string | undefined;
}

/**
 * Renders the region with the machine's context trigger props merged over the caller's.
 *
 * @param props - The region's value and the props of a `div`.
 * @returns The `div` element.
 */
export function ContextTrigger({ value, ...rest }: ContextTriggerProps): ReactElement {
  const { api } = useMenu();
  const named = value === undefined ? {} : { value };

  return <Held {...mergeProps(api.getContextTriggerProps(named), rest)} />;
}
