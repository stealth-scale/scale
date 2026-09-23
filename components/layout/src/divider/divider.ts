/**
 * Renders a divider through the divider recipe.
 *
 * @remarks
 *   The element is `hr`, which has the `separator` role. The component sets `aria-orientation` from
 *   the `orientation` it receives from props or from `DividerPropsProvider`, so a vertical divider
 *   is announced as vertical. The component renders no surface or ink.
 */

import { type ComponentProps, createElement, type ReactElement } from "react";

import { usePropsContext, withContext } from "#divider/context.ts";

/**
 * Renders an `hr` element with the classes of the divider recipe.
 */
const Line = withContext("hr");

/**
 * Describes the props of Divider: the recipe's variants and the props of an `hr` element.
 */
export type DividerProps = ComponentProps<typeof Line>;

/**
 * Renders a horizontal or vertical separator with a matching `aria-orientation`.
 */
export function Divider(props: DividerProps): ReactElement {
  const provided = usePropsContext();
  const orientation = props.orientation ?? provided?.orientation ?? "horizontal";

  return createElement(Line, { "aria-orientation": orientation, ...props });
}
