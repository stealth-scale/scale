import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { calendarCells, Heatmap } from "#heatmap/index.ts";

import { PAGES } from "./days.ts";

export function Pages(): ReactElement {
  const { i18n, t } = useWords("heatmap");

  return (
    <Heatmap
      {...calendarCells(PAGES, { locale: i18n.language, weekStartsOn: "mon" })}
      caption={t("pages.caption", { count: 14 })}
      label={t("pages.label")}
      valueLabel={t("pages.value")}
    />
  );
}
