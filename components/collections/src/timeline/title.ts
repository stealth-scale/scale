/**
 * Renders the headline of an entry, a row that wraps, so a face, a name and the words around them
 * fold onto the next line where there is no room.
 */

import { type ComponentProps } from "react";

import { withContext } from "#timeline/context.ts";

/**
 * Renders the title `div`, as tall as the indicator and centred on it on one line.
 */
export const Title = withContext("div", "title");

/**
 * Describes the props of `Title`.
 */
export type TitleProps = ComponentProps<typeof Title>;
