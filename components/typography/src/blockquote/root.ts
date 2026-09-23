/**
 * Renders the root of a block quotation.
 *
 * @remarks
 *   The element is `figure`, because a quotation with a caption is a self-contained figure and the
 *   caption is its `figcaption`. The root takes the variants and passes them to the other parts.
 */

import { type ComponentProps } from "react";

import { withProvider } from "#blockquote/context.ts";

/**
 * Renders a `figure` element with the root slot's classes and provides the variants to the parts.
 */
export const Root = withProvider("figure", "root");

/**
 * Describes the props of Blockquote.Root: the recipe's variants and the props of a `figure`
 * element.
 */
export type RootProps = ComponentProps<typeof Root>;
