/**
 * Renders the icon that rotates when a branch opens.
 *
 * @remarks
 *   The indicator is `aria-hidden`, because the trigger already exposes `aria-expanded`. The
 *   machine writes `data-state` on it, and the recipe rotates it from that attribute. A caller
 *   passes the glyph without sizing or rotating it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#nav-list/context.ts";
import { useBranch } from "#nav-list/machine.ts";

/**
 * Renders the indicator `span`, hidden from assistive technology.
 */
const Turned = withContext("span", "indicator", { defaultProps: { "aria-hidden": true } });

/**
 * Describes the props of `Indicator`.
 */
export type IndicatorProps = ComponentProps<typeof Turned>;

/**
 * Renders the indicator with the machine's indicator props merged under the caller's.
 */
export function Indicator(props: IndicatorProps): ReactElement {
  const api = useBranch();

  return <Turned {...mergeProps(api.getIndicatorProps(), props)} />;
}
