import { type ReactElement, type ReactNode } from "react";

import { LocaleContext } from "@stealthscale/provider-locale";

import { Root } from "#chart/root.tsx";
import {
  type ChartApi,
  type ChartOptions,
  type SeriesOptions,
  useChart,
} from "#chart/use-chart.ts";

/**
 * Describes one row of the fixture data.
 */
export interface Row {
  readonly day: string;
  readonly paid: number;
  readonly refunded: number;
}

/**
 * Lists three days of payouts.
 */
export const ROWS: Row[] = [
  { day: "Mon", paid: 120, refunded: 12 },
  { day: "Tue", paid: 180, refunded: 30 },
  { day: "Wed", paid: 150, refunded: 8 },
];

/**
 * Lists the two series of the fixture data, the first with a palette.
 */
export const SERIES: readonly SeriesOptions[] = [
  { color: "primary", key: "paid", label: "Paid" },
  { key: "refunded", label: "Refunded" },
];

/**
 * Chart built without the hook, for a check that renders the root on its own.
 */
export const API: ChartApi<Row> = {
  color: () => "var(--colors-blue-chart)",
  data: ROWS,
  formatDate: () => () => "",
  formatNumber: () => () => "",
  hidden: () => false,
  highlight: () => {},
  highlighted: undefined,
  locale: "en-US",
  opacity: () => "1",
  press: () => {},
  series: [
    { color: "var(--colors-blue-chart)", hidden: false, key: "paid", label: "Paid", opacity: "1" },
  ],
};

/**
 * Renders the children in a locale's scope, as the shell's provider does.
 */
export function scoped(locale: string, children: ReactNode): ReactElement {
  return (
    <LocaleContext
      value={{
        direction: "ltr",
        isPending: false,
        locale,
        locales: [locale],
        setLocale: () => {},
      }}
    >
      {children}
    </LocaleContext>
  );
}

/**
 * Describes the props of the fixture root: the chart's options, the root's ratio and the parts.
 */
export interface ChartedProps extends Partial<ChartOptions<Row>> {
  readonly children?: ReactNode;
  readonly ratio?: "square" | "video";
}

/**
 * Renders the parts inside a chart's root, with the fixture rows and series unless stated.
 */
// eslint-disable-next-line react/only-export-components -- the hook runs in a component, and fast refresh never loads a fixture
function Charted({ children, ratio, ...options }: ChartedProps): ReactElement {
  const chart = useChart({ data: ROWS, series: SERIES, ...options });

  return (
    <Root chart={chart} {...(ratio === undefined ? {} : { ratio })}>
      {children}
    </Root>
  );
}

/**
 * Renders the parts inside a chart's root, with the fixture rows and series unless stated.
 */
export function charted(props: ChartedProps = {}): ReactElement {
  return <Charted {...props} />;
}
