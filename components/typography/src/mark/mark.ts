/**
 * Renders a highlight through the mark recipe.
 *
 * @remarks
 *   `mark` exposes the `mark` role, which most screen readers announce only when the user enables
 *   it. A highlight that carries meaning needs a second cue, because WCAG 1.4.1 fails a distinction
 *   made by colour alone. The `text` look adds weight, and a `VisuallyHidden` beside the run states
 *   the meaning to a screen reader.
 */

import { type ComponentProps } from "react";

import { withContext } from "#mark/context.ts";

/**
 * Renders a `mark` element with the classes of the mark recipe.
 */
export const Mark = withContext("mark");

/**
 * Describes the props of Mark: the recipe's variants and the props of a `mark` element.
 */
export type MarkProps = ComponentProps<typeof Mark>;
