/**
 * Draws the mark standing where the crumbs between two steps were left out.
 *
 * @remarks
 *   A trail down a deep hierarchy runs past the width it is given, and a trail that wraps onto a
 *   second line stops reading as one path. A caller drops the middle steps and draws this in their
 *   place, so the first step, the mark and the page a reader is on stay on one line.
 *   A row of the list, like a crumb rather than like a separator, because a reader can see that
 *   something was left out and where. It is named rather than hidden: a trail that quietly skipped
 *   four steps read to a screen reader as a two-step trail, which is a different hierarchy. The
 *   name is the caller's, so it says how many were dropped in the reader's own language.
 *   It draws no mark of its own. This package ships no artwork, so the glyph is the caller's, the
 *   way every other mark in it is.
 */

import { type ComponentProps } from "react";

import { withContext } from "#breadcrumb/context.ts";

/**
 * Draws the mark, named by whatever the caller states on it.
 */
export const Ellipsis = withContext("li", "ellipsis");

/**
 * Describes what the mark takes.
 */
export type EllipsisProps = ComponentProps<typeof Ellipsis>;
