/**
 * Renders the timeline's root: an ordered list that contains one item per entry.
 */

import { type ComponentProps } from "react";

import { withProvider } from "#timeline/context.ts";

/**
 * Renders the root `ol` with the timeline's variants.
 */
export const Root = withProvider("ol", "root");

/**
 * Describes the props of `Root`.
 */
export type RootProps = ComponentProps<typeof Root>;
