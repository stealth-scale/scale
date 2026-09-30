import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { linearRegression, RegressionOverlay } from "#regression-overlay/index.ts";
import { ScatterPlot } from "#scatter-plot/index.ts";

const ONLINE = [
  [9, 520],
  [12, 470],
  [15, 430],
  [18, 395],
  [22, 330],
  [26, 300],
  [30, 250],
  [34, 215],
  [38, 180],
].map(([price = 0, units = 0]) => ({ price, units }));

const STORE = [
  [10, 260],
  [13, 255],
  [17, 240],
  [20, 236],
  [24, 220],
  [28, 214],
  [32, 200],
  [36, 195],
  [40, 182],
].map(([price = 0, units = 0]) => ({ price, units }));

export function Channels(): ReactElement {
  const { i18n, t } = useWords("regression-overlay");
  const online = linearRegression(ONLINE, "price", "units");
  const store = linearRegression(STORE, "price", "units");
  const number = new Intl.NumberFormat(i18n.language, { maximumFractionDigits: 0 });

  return (
    <ScatterPlot
      caption={t("channels.caption", {
        online: number.format(-(online?.slope ?? 0)),
        store: number.format(-(store?.slope ?? 0)),
      })}
      label={t("channels.label")}
      series={[
        { key: "online", label: t("channels.online"), points: ONLINE },
        { key: "store", label: t("channels.store"), points: STORE },
      ]}
      xKey="price"
      xLabel={t("channels.price")}
      xOptions={{ currency: "EUR", maximumFractionDigits: 0, style: "currency" }}
      yKey="units"
      yLabel={t("channels.units")}
    >
      <RegressionOverlay data={ONLINE} series="online" xKey="price" yKey="units" />
      <RegressionOverlay data={STORE} series="store" xKey="price" yKey="units" />
    </ScatterPlot>
  );
}
