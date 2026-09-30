import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { Heatmap } from "#heatmap/index.ts";

import { BUILD_MINUTES, WORKDAYS } from "./readings.ts";

export function Builds(): ReactElement {
  const { t } = useWords("heatmap");
  const [slowest] = BUILD_MINUTES.filter((cell) => cell.column === "fri").toSorted(
    (first, second) => (second.value ?? 0) - (first.value ?? 0),
  );

  return (
    <Heatmap
      caption={t("builds.caption", { minutes: slowest?.value, pipeline: slowest?.row })}
      cells={BUILD_MINUTES}
      columns={WORKDAYS.map((key) => ({ key, label: t(`days.${key}`) }))}
      corner={t("builds.corner")}
      label={t("builds.label")}
      size="lg"
      valueLabel={t("builds.value")}
      values
    />
  );
}
