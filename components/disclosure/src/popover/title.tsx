/**
 * Renders the popover's heading, which names the panel.
 *
 * @remarks
 *   The element is an `h2`. Pass another heading level through `as` to fit the page's outline.
 *   The machine points the panel's `aria-labelledby` at the title.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#popover/context.ts";
import { usePopover } from "#popover/machine.ts";

/**
 * Renders the `h2` with the popover's title class.
 */
const Drawn = withContext("h2", "title");

/**
 * Describes the props of the title: the props of an `h2`.
 */
export type TitleProps = ComponentProps<typeof Drawn>;

/**
 * Renders the title with the machine's title props merged over the caller's.
 *
 * @param props - The props of an `h2`.
 * @returns The heading element.
 */
export function Title(props: TitleProps): ReactElement {
  const api = usePopover();

  return <Drawn {...mergeProps(api.getTitleProps(), props)} />;
}
