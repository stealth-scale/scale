/**
 * Renders the value the trigger shows.
 *
 * @remarks
 *   The text is the selected items' labels joined by commas, truncated to one line, or
 *   `placeholder` while nothing is selected. A function child receives the selected items and
 *   returns what to show in place of the labels, such as a count or tags.
 */

import { type ComponentProps, type ReactElement, type ReactNode } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#select/context.ts";
import { type SelectItem, useSelect } from "#select/machine.ts";

/**
 * Renders the `span` with the select's value text class.
 */
const Shown = withContext("span", "valueText");

/**
 * Describes the props of the value text: the placeholder, the function that renders the selected
 * items, and the props of a `span`.
 */
export interface ValueTextProps extends Omit<ComponentProps<typeof Shown>, "children"> {
  /**
   * Returns what the trigger shows for the selected items, in place of their joined labels.
   */
  readonly children?: ((items: readonly SelectItem[]) => ReactNode) | undefined;

  /**
   * Words the trigger shows while nothing is selected.
   */
  readonly placeholder?: ReactNode;
}

/**
 * Renders the selected items, or the placeholder while nothing is selected.
 *
 * @param props - The placeholder, the function that renders the selected items, and the props of a
 *   `span`.
 * @returns The `span` element.
 */
export function ValueText({ children, placeholder, ...props }: ValueTextProps): ReactElement {
  const api = useSelect();
  const selected = children === undefined ? api.valueAsString : children(api.selectedItems);

  return (
    <Shown {...mergeProps(api.getValueTextProps(), props)}>
      {api.hasSelectedItems ? selected : placeholder}
    </Shown>
  );
}
