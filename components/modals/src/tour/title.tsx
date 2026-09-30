/**
 * Renders a step's heading, which names the card.
 *
 * @remarks
 *   The element is an `h2`. Pass another heading level through `as` to fit the page's outline. The
 *   machine points the card's `aria-labelledby` at the title, so render one in every card. The
 *   title shows the step's `title` unless the caller passes children.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#tour/context.ts";
import { useTourContext } from "#tour/machine.ts";

/**
 * Renders the `h2` with the tour's title class.
 */
const Drawn = withContext("h2", "title");

/**
 * Describes the props of the title: the props of an `h2`.
 */
export type TitleProps = ComponentProps<typeof Drawn>;

/**
 * Renders the title with the machine's title props merged over the caller's.
 *
 * @param props - The props of an `h2`.
 * @returns The heading element.
 */
export function Title({ children, ...props }: TitleProps): ReactElement {
  const api = useTourContext();

  return <Drawn {...mergeProps(api.getTitleProps(), props)}>{children ?? api.step?.title}</Drawn>;
}
