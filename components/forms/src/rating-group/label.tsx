/**
 * Renders the words that name a rating group.
 *
 * @remarks
 *   The element is a `span` inside the group. It names the group while it is mounted, and a press
 *   on it focuses the rated item, or the first one while nothing is rated.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#rating-group/context.ts";
import { useRatingGroup } from "#rating-group/machine.ts";
import { useLabelled } from "#rating-group/state.ts";

/**
 * Renders the `span` with the rating group's label class.
 */
const Named = withContext("span", "label");

/**
 * Describes the props of the label: the props of a `span`.
 */
export type LabelProps = ComponentProps<typeof Named>;

/**
 * Renders the label with the machine's props, less the `for` that points at the hidden input.
 *
 * @param props - Attributes and children of the `span` element, merged over the machine's.
 * @returns The `span` element.
 */
export function Label(props: LabelProps): ReactElement {
  const { htmlFor: _input, ...label } = useRatingGroup().getLabelProps();

  useLabelled();

  return <Named {...mergeProps(label, props)} />;
}
