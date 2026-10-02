/**
 * Renders the trailing region of the alert for controls such as a retry button or a link.
 *
 * @remarks
 *   Label each control with its target, such as `Retry the payment`, because a screen reader user
 *   moving between controls hears the name without the alert's text. Use `Alert.CloseTrigger` for
 *   the dismiss control.
 */

import { type ComponentProps } from "react";

import { withContext } from "#alert/context.ts";

/**
 * Renders a flex div at the inline end, sized to its content.
 */
export const Aside = withContext("div", "aside");

/**
 * Describes the props of Alert.Aside: the props of a div element.
 */
export type AsideProps = ComponentProps<typeof Aside>;
