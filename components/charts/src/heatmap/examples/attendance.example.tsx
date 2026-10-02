import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { Heatmap } from "#heatmap/index.ts";

import { ATTENDANCE, TERM_WEEKS, WORKDAYS } from "./readings.ts";

export function Attendance(): ReactElement {
  const { t } = useWords("heatmap");

  return (
    <Heatmap
      caption={t("attendance.caption")}
      cells={ATTENDANCE}
      columns={TERM_WEEKS.map((key) => ({ key, label: t("attendance.week", { week: key }) }))}
      corner={t("attendance.corner")}
      label={t("attendance.label")}
      rows={WORKDAYS.map((key) => ({ key, label: t(`days.${key}`) }))}
      size="sm"
      valueLabel={t("attendance.value")}
      valueOptions={{ style: "unit", unit: "percent" }}
    />
  );
}
