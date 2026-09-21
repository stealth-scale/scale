/**
 * Renders content that assistive technology can reach and the browser never paints.
 *
 * @remarks
 *   The default element is a `span`, which contributes no semantics of its own; callers that need
 *   a landmark, a heading or a table cell override the element with `as`. The content is clipped
 *   rather than removed, so it remains in the accessibility tree. The usual cases are the
 *   accessible name of an icon-only control, a heading the document outline requires but the
 *   layout has no room for, and instructions that should be announced before a control.
 */

import { type ComponentProps } from "react";

import { withContext } from "#visually-hidden/context.ts";

/**
 * Exposes its children to assistive technology without rendering them visibly.
 */
export const VisuallyHidden = withContext("span");

/**
 * Props accepted by `VisuallyHidden`: the recipe's variants plus the props of a styled `span`.
 */
export type VisuallyHiddenProps = ComponentProps<typeof VisuallyHidden>;
