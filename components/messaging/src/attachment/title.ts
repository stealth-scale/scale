/**
 * Renders the file's name, on one line that ends in an ellipsis where it does not fit.
 */

import { type ComponentProps } from "react";

import { withContext } from "#attachment/context.ts";

/**
 * Renders the title's `span`.
 */
export const Title = withContext("span", "title");

/**
 * Describes the props of `Title`.
 */
export type TitleProps = ComponentProps<typeof Title>;
