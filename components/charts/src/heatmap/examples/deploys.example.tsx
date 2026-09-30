import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { calendarCells, Heatmap } from "#heatmap/index.ts";

import { DEPLOYS } from "./days.ts";

export function Deploys(): ReactElement {
  const { i18n, t } = useWords("heatmap");
  const calendar = calendarCells(DEPLOYS, {
    from: "2025-10-01",
    locale: i18n.language,
    to: "2026-09-30",
  });

  return (
    <Heatmap
      {...calendar}
      caption={t("deploys.caption", { count: 80 })}
      label={t("deploys.label")}
      missingLabel={t("deploys.missing")}
      size="sm"
      valueLabel={t("deploys.value")}
    />
  );
}
