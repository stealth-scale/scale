/**
 * Renders a box that contains the fixed positioning of the example inside it.
 *
 * @remarks
 *   A scene renders an example with a control that is fixed to the window under keyboard focus,
 *   such as a skip link, inside this box. Tab reveals the control at the box's corner, so the
 *   reader sees it in the scene and not over the catalogue.
 */

import { type ComponentProps } from "react";

import { withContext } from "#contained/context.ts";

/**
 * Renders a `div` element with the classes of the contained recipe.
 */
export const Contained = withContext("div");

/**
 * Describes the props of Contained: the props of a `div` element.
 */
export type ContainedProps = ComponentProps<typeof Contained>;
