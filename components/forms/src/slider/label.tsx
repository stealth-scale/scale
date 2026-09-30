/**
 * Renders the words that name a slider.
 *
 * @remarks
 *   The element is a `label`. It names the thumbs while it is mounted, and a press on it focuses
 *   the first thumb.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#slider/context.ts";
import { useSlider } from "#slider/machine.ts";
import { useLabelled } from "#slider/state.ts";

/**
 * Renders the `label` with the slider's label class.
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
  const api = useSlider();

  useLabelled();

  return <Named {...mergeProps(api.getLabelProps(), props)} />;
}
