/**
 * Renders the text under a step's title, which describes the card.
 *
 * @remarks
 *   The element is a `p`. Pass `as="div"` for a description that contains blocks. The machine
 *   points the card's `aria-describedby` at the description, so render one in every card. The
 *   description shows the step's `description` unless the caller passes children.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#tour/context.ts";
import { useTourContext } from "#tour/machine.ts";

/**
 * Renders the `p` with the tour's description class.
 */
const Drawn = withContext("p", "description");

/**
 * Describes the props of the description: the props of a `p`.
 */
export type DescriptionProps = ComponentProps<typeof Drawn>;

/**
 * Renders the description with the machine's description props merged over the caller's.
 *
 * @param props - The props of a `p`.
 * @returns The `p` element.
 */
export function Description({ children, ...props }: DescriptionProps): ReactElement {
  const api = useTourContext();

  return (
    <Drawn {...mergeProps(api.getDescriptionProps(), props)}>
      {children ?? api.step?.description}
    </Drawn>
  );
}
