/**
 * Renders the data list's root: a `dl` that contains one item per pair.
 */

import { type ComponentProps } from "react";

import { withProvider } from "#data-list/context.ts";

/**
 * Renders the root `dl` with the list's variants.
 */
export const Root = withProvider("dl", "root");

/**
 * Describes the props of `Root`.
 */
export type RootProps = ComponentProps<typeof Root>;
