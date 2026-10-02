import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { TimelineChart, type TimelineEvent } from "#timeline-chart/index.ts";

const MOMENTS: ReadonlyArray<{
  at: string;
  color?: TimelineEvent["color"];
  kind: string;
  lane: string;
}> = [
  { at: "13:52:00", kind: "deploy", lane: "changes" },
  { at: "14:03:05", color: "warning", kind: "latency", lane: "alerts" },
  { at: "14:03:20", color: "error", kind: "errors", lane: "alerts" },
  { at: "14:03:41", color: "warning", kind: "latency", lane: "alerts" },
  { at: "14:04:02", color: "warning", kind: "queue", lane: "alerts" },
  { at: "14:04:18", color: "error", kind: "errors", lane: "alerts" },
  { at: "14:04:37", color: "error", kind: "checkout", lane: "alerts" },
  { at: "14:05:02", color: "warning", kind: "latency", lane: "alerts" },
  { at: "14:21:00", kind: "rollback", lane: "changes" },
  { at: "14:26:30", color: "success", kind: "recovered", lane: "alerts" },
];

export function Burst(): ReactElement {
  const { i18n, t } = useWords("timeline-chart");

  return (
    <TimelineChart
      caption={t("burst.caption")}
      defaultIndex={2}
      events={MOMENTS.map((moment, index) => ({
        at: `2026-09-28T${moment.at}Z`,
        color: moment.color,
        key: String(index),
        label: t(`burst.${moment.kind}`),
        lane: moment.lane,
      }))}
      label={t("burst.label")}
      labelOptions={{
        hour: "2-digit",
        hourCycle: "h23",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "UTC",
      }}
      lanes={[
        { key: "changes", label: t("burst.changes") },
        { key: "alerts", label: t("burst.alerts") },
      ]}
      locale={i18n.language}
      moreLabel={(count) => t("burst.more", { count })}
      since="2026-09-28T13:30:00Z"
      until="2026-09-28T15:30:00Z"
    />
  );
}
