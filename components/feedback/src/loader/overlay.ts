/**
 * Renders the overlay that covers a positioned container while its content loads.
 *
 * @remarks
 *   The overlay is absolutely positioned at `inset: 0`, so the container it covers must be
 *   positioned, as `Card.Root` is. It takes the container's corner radius and centres its children,
 *   such as a `Loader` with `text`. The `scrim` axis sets its fill.
 */

import { type ComponentProps, type JSX } from "react";

import { withProvider } from "#loader/context.ts";

/**
 * Renders the overlay `div` with the recipe's `overlay` slot.
 */
const Overlay = withProvider("div", "overlay");

/**
 * Describes the props of `LoaderOverlay`: the `scrim` axis and the props of a `div`.
 */
export type LoaderOverlayProps = Omit<ComponentProps<typeof Overlay>, "palette">;

/**
 * Renders the overlay `div`, veiled by default.
 */
export const LoaderOverlay: (props: LoaderOverlayProps) => JSX.Element = Overlay;
