/**
 * Renders the stat's root: a `dl` whose term is the label and whose details are the value and the
 * help text.
 */

import { type ComponentProps } from "react";

import { withProvider } from "#stat/context.ts";

/**
 * Renders the root `dl` with the stat's variants.
 */
export const Root = withProvider("dl", "root");

/**
 * Describes the props of `Root`.
 */
export type RootProps = ComponentProps<typeof Root>;
