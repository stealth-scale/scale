/**
 * Renders the label of the code, such as a file name.
 *
 * @remarks
 *   The element is a `div` with no heading role, because a code block is not a section of the page.
 *   A label wider than the header truncates with an ellipsis on one line. While the title renders,
 *   it names the scrolling region of the code, so it takes the ID the root gives it.
 */

import { type ComponentProps, createElement, type ReactElement } from "react";

import { withContext } from "#code-block/context.ts";
import { useCode, useLabelled } from "#code-block/state.ts";

/**
 * Renders the `div` with the recipe's title class.
 */
const Titled = withContext("div", "title");

/**
 * Describes the props of `Title`: the props of the styled `div`, without `id`, which the root
 * gives it.
 */
export type TitleProps = Omit<ComponentProps<typeof Titled>, "id">;

/**
 * Renders the title with the root's ID and reports it to the root while it renders.
 *
 * @param props - The props of the styled `div`.
 * @returns The `div` element.
 */
export function Title(props: TitleProps): ReactElement {
  const { titleId } = useCode();

  useLabelled();

  return createElement(Titled, { ...props, id: titleId });
}
