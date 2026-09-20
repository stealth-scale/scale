/**
 * Draws the words that name the rail.
 *
 * @remarks
 *   The element is `div` and carries no heading role. The rail is a landmark named by these
 *   words, and a heading here would put one more entry in the outline of the page the rail lists.
 *   The machine gives it the id the landmark names itself by.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#toc/context.ts";
import { useToc } from "#toc/machine.ts";

/**
 * Draws the words at the size the root states.
 */
const Named = withContext("div", "title");

/**
 * Describes what the title takes.
 */
export type TitleProps = ComponentProps<typeof Named>;

/**
 * Draws the words the landmark is named by.
 *
 * @param props - Everything a styled div takes.
 * @returns The words, carrying the id the landmark names itself by.
 */
export function Title(props: TitleProps): ReactElement {
  const api = useToc();

  return <Named {...mergeProps(api.getTitleProps(), props)} />;
}
