import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { PieChart } from "#pie-chart/index.ts";

const SESSIONS = [
  { key: "chrome", value: 5840 },
  { key: "safari", value: 2310 },
  { key: "edge", value: 1120 },
  { key: "firefox", value: 640 },
  { key: "samsung", value: 310 },
  { key: "opera", value: 180 },
  { key: "arc", value: 90 },
];

export function Browsers(): ReactElement {
  const { t } = useWords("pie-chart");

  return (
    <PieChart
      caption={t("browsers.caption")}
      label={t("browsers.label")}
      legendLabel={t("browsers.legend")}
      maxSlices={4}
      otherLabel={t("browsers.other")}
      slices={SESSIONS.map(({ key, value }) => ({ key, label: t(`browsers.${key}`), value }))}
    />
  );
}
