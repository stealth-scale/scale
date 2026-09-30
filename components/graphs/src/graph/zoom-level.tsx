/**
 * Renders the canvas's zoom level as a percentage in the toolbar.
 *
 * @remarks
 *   The element is an `output`, which reads its value to a screen reader when it changes. The
 *   percentage is written in `locale`, else the nearest `LocaleProvider`'s, else the runtime's.
 */

import { type ComponentProps, type ReactElement, use } from "react";

import { useStore } from "@xyflow/react";

import { LocaleContext } from "@stealthscale/provider-locale";

import { withContext } from "#graph/context.ts";

/**
 * Renders the `output` with the recipe's level class.
 */
const Shown = withContext("output", "level");

/**
 * Describes the props of the zoom level: its locale and the props of an `output`.
 */
export interface ZoomLevelProps extends Omit<ComponentProps<typeof Shown>, "children"> {
  /**
   * Locale the percentage is written in.
   */
  readonly locale?: string | undefined;
}

/**
 * Renders the canvas's zoom as a percentage.
 *
 * @param props - The locale and the props of the `output`.
 */
export function ZoomLevel({ locale, ...props }: ZoomLevelProps): ReactElement {
  const zoom = useStore((state) => state.transform[2]);
  const scoped = use(LocaleContext)?.locale;
  const percent = new Intl.NumberFormat(locale ?? scoped, { style: "percent" });

  return <Shown {...props}>{percent.format(zoom)}</Shown>;
}
