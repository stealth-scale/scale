/**
 * Renders the band with the title, the description and the actions.
 *
 * @remarks
 *   The element is `header`, which is a banner landmark only at the top of a document, and plain
 *   content inside a `section`. It is a grid of two rows, so its parts are siblings placed by area
 *   name.
 */

import { type ComponentProps } from "react";

import { withContext } from "#section/context.ts";

/**
 * Renders the `header` with the recipe's header class.
 */
export const Header = withContext("header", "header");

/**
 * Describes the props of the header: the props of a `header`.
 */
export type HeaderProps = ComponentProps<typeof Header>;
