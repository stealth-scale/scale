import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { linearRegression, RegressionOverlay } from "#regression-overlay/index.ts";
import { ScatterPlot } from "#scatter-plot/index.ts";

const PRODUCTS = [
  [9, 410],
  [12, 388],
  [14, 352],
  [15, 371],
  [18, 318],
  [20, 290],
  [22, 301],
  [25, 262],
  [27, 240],
  [30, 228],
  [32, 199],
  [35, 187],
  [38, 170],
  [40, 152],
].map(([price = 0, units = 0]) => ({ price, units }));

export function Fit(): ReactElement {
  const { i18n, t } = useWords("regression-overlay");
  const fit = linearRegression(PRODUCTS, "price", "units");
  const number = new Intl.NumberFormat(i18n.language, { maximumFractionDigits: 2 });

  return (
    <ScatterPlot
      caption={t("fit.caption", {
        r2: number.format(fit?.r2 ?? 0),
        units: number.format(Math.round(-(fit?.slope ?? 0))),
      })}
      label={t("fit.label")}
      series={[{ key: "products", label: t("fit.products"), points: PRODUCTS }]}
      xKey="price"
      xLabel={t("fit.price")}
      xOptions={{ currency: "EUR", maximumFractionDigits: 0, style: "currency" }}
      yKey="units"
      yLabel={t("fit.units")}
    >
      <RegressionOverlay data={PRODUCTS} xKey="price" yKey="units" />
    </ScatterPlot>
  );
}
