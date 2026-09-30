/**
 * Renders the mark inside the summary that turns a quarter while the details is open.
 *
 * @remarks
 *   The caller passes the glyph, a chevron that points to the end, and the recipe sizes and turns
 *   it. The indicator sets `aria-hidden`, because the summary reports its state and a mark inside
 *   it joins its name. A caller whose mark adds information sets `aria-hidden={false}`.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#details/context.ts";

/**
 * Renders the `span` with the details' indicator class.
 */
const Turned = withContext("span", "indicator");

/**
 * Describes the props of the indicator: the props of a `span`.
 */
export type IndicatorProps = ComponentProps<typeof Turned>;

/**
 * Renders the indicator, hidden from assistive technology.
 *
 * @param props - The props of a `span`.
 * @returns The `span` element.
 */
export function Indicator(props: IndicatorProps): ReactElement {
  return <Turned aria-hidden {...props} />;
}
