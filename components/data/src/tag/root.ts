/**
 * Renders the tag's root: an inline `span` that contains the label, the marks and the close
 * trigger.
 */

import { type ComponentProps } from "react";

import { withProvider } from "#tag/context.ts";

/**
 * Renders the root `span` with the tag's variants.
 */
export const Root = withProvider("span", "root");

/**
 * Describes the props of `Root`.
 */
export type RootProps = ComponentProps<typeof Root>;
