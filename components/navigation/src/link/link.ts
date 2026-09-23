/**
 * Renders a styled anchor through the link recipe.
 *
 * @remarks
 *   The element is `a`. A browser focuses an anchor, follows it on Enter and offers to open it in a
 *   new tab only when it has an `href`, so a control that runs an action is a button. A router's
 *   link component goes in through `as`, which keeps its routing and takes the recipe's classes.
 */

import { type ComponentProps } from "react";

import { withContext } from "#link/context.ts";

/**
 * Renders an anchor with the link recipe's classes.
 */
export const Link = withContext("a");

/**
 * Describes the props of Link: the recipe's variants and the props of an anchor element.
 */
export type LinkProps = ComponentProps<typeof Link>;
