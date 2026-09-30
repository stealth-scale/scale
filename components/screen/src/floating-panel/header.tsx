/**
 * Renders the band at the top of the panel, with the drag trigger and the controls.
 *
 * @remarks
 *   The element is a `div` with no role, because the title supplies the heading. A minimized panel
 *   is as tall as its header, which the machine measures by the id it writes here.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#floating-panel/context.ts";
import { useFloatingPanel } from "#floating-panel/machine.ts";

/**
 * Renders the `div` with the floating panel's header class.
 */
const Drawn = withContext("div", "header");

/**
 * Describes the props of the header: the props of a `div`.
 */
export type HeaderProps = ComponentProps<typeof Drawn>;

/**
 * Renders the header with the machine's header props merged under the caller's.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element.
 */
export function Header(props: HeaderProps): ReactElement {
  const { api } = useFloatingPanel();

  return <Drawn {...mergeProps(api.getHeaderProps(), props)} />;
}
