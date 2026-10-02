/**
 * Renders the floating panel's heading, which names the panel.
 *
 * @remarks
 *   The element is an `h2`. Pass another heading level through `as` to fit the page's outline. The
 *   machine points the panel's `aria-labelledby` at the title. A panel without a title takes
 *   `aria-label` on its content.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#floating-panel/context.ts";
import { useFloatingPanel } from "#floating-panel/machine.ts";

/**
 * Renders the `h2` with the floating panel's title class.
 */
const Drawn = withContext("h2", "title");

/**
 * Describes the props of the title: the props of an `h2`.
 */
export type TitleProps = ComponentProps<typeof Drawn>;

/**
 * Renders the title with the machine's title props merged under the caller's.
 *
 * @param props - The props of an `h2`.
 * @returns The heading element.
 */
export function Title(props: TitleProps): ReactElement {
  const { api } = useFloatingPanel();

  return <Drawn {...mergeProps(api.getTitleProps(), props)} />;
}
