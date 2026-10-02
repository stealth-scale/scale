/**
 * Renders a checkbox card's box.
 *
 * @remarks
 *   The element is a `span` the machine hides from assistive technology, because the card's
 *   `input` already reports the state. It is a `span` and not the checkbox's `div`, because the
 *   card is a `label`, which contains only phrasing content. The card renders the focus ring.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#checkbox-card/context.ts";
import { useCheckbox } from "#checkbox/machine.ts";

/**
 * Renders the `span` with the checkbox card's control class.
 */
const Boxed = withContext("span", "control");

/**
 * Describes the props of the box: the props of a `span`.
 */
export type ControlProps = ComponentProps<typeof Boxed>;

/**
 * Renders the box with the machine's control props.
 *
 * @param props - Attributes and children of the `span` element, merged over the machine's.
 * @returns The `span` element that contains the indicators.
 */
export function Control(props: ControlProps): ReactElement {
  const api = useCheckbox();

  return <Boxed {...mergeProps(api.getControlProps(), props)} />;
}
