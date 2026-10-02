import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { TimelineChart, type TimelineEvent } from "#timeline-chart/index.ts";

const MOMENTS: TimelineEvent[] = [];

export function Quiet(): ReactElement {
  const { i18n, t } = useWords("timeline-chart");

  return (
    <TimelineChart
      caption={t("quiet.caption")}
      empty={t("quiet.empty")}
      events={MOMENTS}
      label={t("quiet.label")}
      locale={i18n.language}
    />
  );
}
