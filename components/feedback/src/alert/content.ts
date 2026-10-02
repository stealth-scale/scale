/**
 * Renders the text region of the alert around its title and description.
 *
 * @remarks
 *   The element is a `div` with no role. The root's `layout` stacks the children or runs them on
 *   one line. The region fills the space the indicator and the trailing controls leave, and its
 *   `min-inline-size: 0` lets a long unbroken string wrap instead of pushing the controls out of
 *   the alert.
 */

import { type ComponentProps } from "react";

import { withContext } from "#alert/context.ts";

/**
 * Renders the flex container of the title and the description.
 */
export const Content = withContext("div", "content");

/**
 * Describes the props of Alert.Content: the props of a div element.
 */
export type ContentProps = ComponentProps<typeof Content>;
