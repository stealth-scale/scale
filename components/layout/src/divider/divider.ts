/**
 * Renders a divider through the divider recipe: a separator, or a label between two lines.
 *
 * @remarks
 *   A divider without a label is an `hr`, which has the `separator` role. The component sets
 *   `aria-orientation` from the `orientation` it receives from props or from
 *   `DividerPropsProvider`, so a vertical divider is announced as vertical. A labelled divider is a
 *   `div` without a role, because a separator's children are presentational and a screen reader
 *   would skip the label. The component renders no surface or ink.
 */

import { type ComponentProps, createElement, type ReactElement, type ReactNode } from "react";

import { usePropsContext, withContext } from "#divider/context.ts";

/**
 * Renders an `hr` element with the classes of the divider recipe.
 */
const Line = withContext("hr");

/**
 * Describes the props of Divider: the recipe's variants, the props of an `hr` element and a label.
 */
export type DividerProps = {
  /**
   * Content between two lines, placed by `labelPlacement`. A vertical divider renders no label.
   */
  label?: ReactNode;
} & ComponentProps<typeof Line>;

/**
 * Renders a horizontal or vertical separator with a matching `aria-orientation`, or a label between
 * two horizontal lines.
 */
export function Divider({ label, ...props }: DividerProps): ReactElement {
  const provided = usePropsContext();
  const orientation = props.orientation ?? provided?.orientation ?? "horizontal";

  if (label === undefined || orientation === "vertical") {
    return createElement(Line, { "aria-orientation": orientation, ...props });
  }

  return createElement(Line, { as: "div", "data-labelled": "", ...props }, label);
}
