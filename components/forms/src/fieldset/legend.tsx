/**
 * Renders the group's name.
 *
 * @remarks
 *   The element is a `legend`. Assistive technology reads it with each control in the group, so
 *   three radio buttons are announced as options of "Delivery". It stays enabled while the group is
 *   disabled, because the first legend is exempt from the `fieldset`'s `disabled`.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#fieldset/context.ts";
import { useFieldset } from "#fieldset/state.ts";

/**
 * Renders the `legend` with the fieldset's legend class.
 */
const Worded = withContext("legend", "legend");

/**
 * Describes the props of the legend: the props of a `legend`.
 */
export type LegendProps = ComponentProps<typeof Worded>;

/**
 * Renders the legend.
 *
 * @param props - Attributes and children of the `legend` element.
 * @returns The `legend` element, with the group's label identifier.
 */
export function Legend(props: LegendProps): ReactElement {
  const { ids } = useFieldset();

  return <Worded id={ids.label} {...props} />;
}
