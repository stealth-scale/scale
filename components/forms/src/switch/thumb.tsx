/**
 * Renders the switch's thumb.
 *
 * @remarks
 *   The element is a `span` that the machine hides from assistive technology, because the root's
 *   `input` already reports the state. The thumb states no size. It fills the track's content box
 *   as a square, so the track's size sets both.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#switch/context.ts";
import { useSwitch } from "#switch/machine.ts";

/**
 * Renders the `span` with the switch's thumb class.
 */
const Knobbed = withContext("span", "thumb");

/**
 * Describes the props of the thumb: the props of a `span`.
 */
export type ThumbProps = ComponentProps<typeof Knobbed>;

/**
 * Renders the thumb with the machine's thumb props.
 *
 * @param props - Attributes and children of the `span` element, merged over the machine's.
 * @returns The `span` element, at the track's start while off and at its end while checked.
 */
export function Thumb(props: ThumbProps): ReactElement {
  const api = useSwitch();

  return <Knobbed {...mergeProps(api.getThumbProps(), props)} />;
}
