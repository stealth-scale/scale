import { type ReactElement, useState } from "react";

import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import { TimelineChart, type TimelineEvent } from "#timeline-chart/index.ts";

const MOMENTS: ReadonlyArray<{
  at: string;
  color?: TimelineEvent["color"];
  kind: string;
  lane: string;
  version?: string;
}> = [
  { at: "03:00", color: "neutral", kind: "backup", lane: "db" },
  { at: "09:12", kind: "deploy", lane: "api", version: "4.12" },
  { at: "11:40", color: "warning", kind: "slow", lane: "db" },
  { at: "14:03", color: "warning", kind: "latency", lane: "api" },
  { at: "14:05", color: "error", kind: "errors", lane: "api" },
  { at: "14:09", color: "warning", kind: "latency", lane: "api" },
  { at: "16:05", kind: "rollback", lane: "api", version: "4.11" },
  { at: "18:40", kind: "deploy", lane: "api", version: "4.13" },
  { at: "23:10", color: "neutral", kind: "failover", lane: "db" },
];

export function Select(): ReactElement {
  const { i18n, t } = useWords("timeline-chart");
  const [picked, setPicked] = useState<readonly TimelineEvent[]>([]);
  const list = new Intl.ListFormat(i18n.language);

  return (
    <Stack>
      <TimelineChart
        caption={t("select.caption")}
        events={MOMENTS.map((moment, index) => ({
          at: `2026-09-28T${moment.at}:00Z`,
          color: moment.color,
          key: String(index),
          label: t(`deploys.${moment.kind}`, { version: moment.version }),
          lane: moment.lane,
        }))}
        label={t("select.label")}
        labelOptions={{ hour: "2-digit", hourCycle: "h23", minute: "2-digit", timeZone: "UTC" }}
        lanes={[
          { key: "api", label: t("deploys.api") },
          { key: "db", label: t("deploys.db") },
        ]}
        locale={i18n.language}
        onSelect={setPicked}
        since="2026-09-28T00:00:00Z"
        until="2026-09-29T00:00:00Z"
      />
      <Text as="output" size="sm" tone="muted">
        {picked.length === 0
          ? t("select.none")
          : t("select.picked", {
              count: picked.length,
              list: list.format(picked.map((event) => event.label)),
            })}
      </Text>
    </Stack>
  );
}
