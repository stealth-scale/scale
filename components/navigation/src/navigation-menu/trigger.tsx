/**
 * Renders the button that opens its item's panel.
 *
 * @remarks
 *   The element is a `button` with `aria-expanded` and `aria-controls` pointing at the panel, the
 *   disclosure pattern of the WAI-ARIA navigation example. A mouse over it opens the panel after
 *   the root's `openDelay`, 200ms by default, and a press toggles it. An `svg` inside it, such as a
 *   chevron, turns over while the panel is open.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#navigation-menu/context.ts";
import { useNavigationMenu } from "#navigation-menu/machine.ts";
import { useItem } from "#navigation-menu/scopes.ts";

/**
 * Renders the `button` with the navigation menu's trigger class.
 */
const Pressed = withContext("button", "trigger");

/**
 * Describes the props of the trigger: its words, its glyph and the props of a `button`.
 */
export type TriggerProps = ComponentProps<typeof Pressed>;

/**
 * Renders the trigger with the machine's props for its item.
 *
 * @param props - The words, the glyph and the props of a `button`.
 * @returns The `button` element.
 */
export function Trigger(props: TriggerProps): ReactElement {
  const api = useNavigationMenu();

  return <Pressed {...mergeProps(api.getTriggerProps(useItem()), props)} />;
}
