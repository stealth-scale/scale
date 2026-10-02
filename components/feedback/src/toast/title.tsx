/**
 * Renders the title of a toast.
 *
 * @remarks
 *   The machine gives the element the id the root's `aria-labelledby` points at, so a screen reader
 *   names the toast by its title. The element is a `div`, because a toast is not a section of the
 *   page's outline.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#toast/context.ts";
import { useToast } from "#toast/machine.ts";

/**
 * Renders the `div` with the toast's title class.
 */
const Drawn = withContext("div", "title");

/**
 * Describes the props of the title: the props of a `div`.
 */
export type TitleProps = ComponentProps<typeof Drawn>;

/**
 * Renders the title with the machine's title props merged over the caller's.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element.
 */
export function Title(props: TitleProps): ReactElement {
  const api = useToast();

  return <Drawn {...mergeProps(api.getTitleProps(), props)} />;
}
