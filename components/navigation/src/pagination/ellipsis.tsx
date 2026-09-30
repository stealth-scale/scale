/**
 * Renders the mark that replaces the pages left out between two numbers.
 *
 * @remarks
 *   The element is a `span` with "…" unless the caller passes children, hidden from assistive
 *   technology, because the page numbers on each side already state the gap.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#pagination/context.ts";
import { usePagination } from "#pagination/machine.ts";

/**
 * Renders the `span` with the pagination's ellipsis class.
 */
const Gap = withContext("span", "ellipsis");

/**
 * Describes the props of the ellipsis: its place among the pages and the props of a `span`.
 */
export interface EllipsisProps extends ComponentProps<typeof Gap> {
  /**
   * Index of the mark in the machine's list of pages.
   */
  readonly index: number;
}

/**
 * Renders the ellipsis with the machine's props merged over the caller's.
 *
 * @param props - The mark's index and the props of a `span`.
 * @returns The `span` element.
 */
export function Ellipsis({ children, index, ...rest }: EllipsisProps): ReactElement {
  const { api } = usePagination();

  return (
    <Gap {...mergeProps(api.getEllipsisProps({ index }), { "aria-hidden": true }, rest)}>
      {children ?? "…"}
    </Gap>
  );
}
