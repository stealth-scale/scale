import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { TimelineChart, type TimelineEvent } from "#timeline-chart/index.ts";

const MOMENTS: ReadonlyArray<{
  at: string;
  color?: TimelineEvent["color"];
  kind: string;
  lane?: string;
  version?: string;
}> = [
  { at: "03:00", color: "neutral", kind: "backup", lane: "db" },
  { at: "06:30", color: "warning", kind: "backlog", lane: "worker" },
  { at: "08:10", color: "success", kind: "cleared", lane: "worker" },
  { at: "09:12", kind: "deploy", lane: "api", version: "4.12" },
  { at: "10:05", kind: "deploy", lane: "web", version: "2.8" },
  { at: "11:40", color: "warning", kind: "slow", lane: "db" },
  { at: "13:20", kind: "deploy", lane: "web", version: "2.9" },
  { at: "14:03", color: "warning", kind: "latency", lane: "api" },
  { at: "14:05", color: "error", kind: "errors", lane: "api" },
  { at: "14:09", color: "warning", kind: "latency", lane: "api" },
  { at: "14:12", color: "info", kind: "notice" },
  { at: "16:20", kind: "rollback", lane: "api", version: "4.11" },
  { at: "18:40", kind: "deploy", lane: "api", version: "4.13" },
  { at: "20:55", kind: "deploy", lane: "web", version: "2.9.1" },
  { at: "21:15", kind: "deploy", lane: "worker", version: "1.7" },
  { at: "23:10", color: "neutral", kind: "failover", lane: "db" },
];

export function Deploys(): ReactElement {
  const { i18n, t } = useWords("timeline-chart");

  return (
    <TimelineChart
      caption={t("deploys.caption")}
      events={MOMENTS.map((moment, index) => ({
        at: `2026-09-28T${moment.at}:00Z`,
        color: moment.color,
        key: String(index),
        label: t(`deploys.${moment.kind}`, { version: moment.version }),
        lane: moment.lane,
      }))}
      label={t("deploys.label")}
      labelOptions={{ hour: "2-digit", hourCycle: "h23", minute: "2-digit", timeZone: "UTC" }}
      lanes={[
        { key: "api", label: t("deploys.api") },
        { key: "web", label: t("deploys.web") },
        { key: "worker", label: t("deploys.worker") },
        { key: "db", label: t("deploys.db") },
      ]}
      locale={i18n.language}
      otherLabel={t("deploys.other")}
      since="2026-09-28T00:00:00Z"
      until="2026-09-29T00:00:00Z"
    />
  );
}
