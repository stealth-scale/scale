/**
 * Renders the status's root: an inline `span` that contains the dot and the word.
 *
 * @remarks
 *   The root is a `span`, so a status is valid inside a paragraph, a table cell or a button.
 */

import { type ComponentProps } from "react";

import { withProvider } from "#status/context.ts";

/**
 * Renders the root `span` with the status's variants.
 */
export const Root = withProvider("span", "root");

/**
 * Describes the props of `Root`.
 */
export type RootProps = ComponentProps<typeof Root>;
