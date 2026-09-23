/**
 * Renders the element before the tag's label, which contains a mark such as the kind of thing the
 * tag names.
 */

import { type ComponentProps } from "react";

import { withContext } from "#tag/context.ts";

/**
 * Renders the start element `span`.
 */
export const StartElement = withContext("span", "startElement");

/**
 * Describes the props of `StartElement`.
 */
export type StartElementProps = ComponentProps<typeof StartElement>;
