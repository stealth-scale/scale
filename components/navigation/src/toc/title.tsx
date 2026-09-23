/**
 * Renders the title that labels the table of contents.
 *
 * @remarks
 *   The element is `div` with no heading role, so the title adds no entry to the outline of the
 *   page the list describes. The machine sets its ID, and the root's `aria-labelledby` references
 *   it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#toc/context.ts";
import { useToc } from "#toc/machine.ts";

/**
 * Div with the title slot classes.
 */
const Styled = withContext("div", "title");

/**
 * Describes the props of Toc.Title: the props of a div element.
 */
export type TitleProps = ComponentProps<typeof Styled>;

/**
 * Renders a div with the ID the root's `aria-labelledby` references.
 */
export function Title(props: TitleProps): ReactElement {
  const api = useToc();

  return <Styled {...mergeProps(api.getTitleProps(), props)} />;
}
