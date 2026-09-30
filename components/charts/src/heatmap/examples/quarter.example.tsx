import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { calendarCells, Heatmap } from "#heatmap/index.ts";

import { DEPLOYS } from "./days.ts";

export function Quarter(
  props: Omit<Parameters<typeof Heatmap>[0], "cells" | "label">,
): ReactElement {
  const { i18n, t } = useWords("heatmap");
  const calendar = calendarCells(DEPLOYS, {
    from: "2026-01-01",
    locale: i18n.language,
    to: "2026-03-31",
  });

  return (
    <Heatmap
      {...calendar}
      label={t("quarter.label")}
      missingLabel={t("deploys.missing")}
      valueLabel={t("deploys.value")}
      {...props}
    />
  );
}
