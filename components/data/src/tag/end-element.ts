/**
 * Renders the element after the tag's label, which contains a mark such as a state.
 */

import { type ComponentProps } from "react";

import { withContext } from "#tag/context.ts";

/**
 * Renders the end element `span`.
 */
export const EndElement = withContext("span", "endElement");

/**
 * Describes the props of `EndElement`.
 */
export type EndElementProps = ComponentProps<typeof EndElement>;
