/**
 * Renders the text that states the current page.
 *
 * @remarks
 *   The element is an `output`, which a screen reader treats as a polite status, so the new text is
 *   read after a press on a page or a trigger. The text is "Page 12 of 24" unless the caller passes
 *   another `format`.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#pagination/context.ts";
import { usePagination } from "#pagination/machine.ts";
import { type PageFormat, worded } from "#pagination/wording.ts";

/**
 * Renders the `output` with the pagination's page text class.
 */
const Stated = withContext("output", "pageText");

/**
 * Describes the props of the page text: its format and the props of an `output` without children.
 */
export interface PageTextProps extends Omit<ComponentProps<typeof Stated>, "children"> {
  /**
   * How the text words the current page, `compact` unless the caller passes another.
   */
  readonly format?: PageFormat | undefined;
}

/**
 * Renders the text for the current page.
 *
 * @param props - The format and the props of an `output`.
 * @returns The `output` element.
 */
export function PageText({ format = "compact", ...rest }: PageTextProps): ReactElement {
  const { api } = usePagination();

  return <Stated {...rest}>{worded(api, format)}</Stated>;
}
