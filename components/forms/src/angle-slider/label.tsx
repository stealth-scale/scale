/**
 * Renders the words that name an angle slider.
 *
 * @remarks
 *   The element is a `label`. It names the thumb while it is mounted, and a press on it focuses
 *   the thumb.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#angle-slider/context.ts";
import { useAngleSlider } from "#angle-slider/machine.ts";
import { useLabelled } from "#angle-slider/state.ts";

/**
 * Renders the `label` with the angle slider's label class.
 */
const Named = withContext("label", "label");

/**
 * Describes the props of the label: the props of a `label`.
 */
export type LabelProps = ComponentProps<typeof Named>;

/**
 * Renders the label with the machine's props.
 *
 * @param props - Attributes and children of the `label` element, merged over the machine's.
 * @returns The `label` element.
 */
export function Label(props: LabelProps): ReactElement {
  const api = useAngleSlider();

  useLabelled();

  return <Named {...mergeProps(api.getLabelProps(), props)} />;
}
