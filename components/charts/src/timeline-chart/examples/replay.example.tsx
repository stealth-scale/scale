import { type ReactElement, useState } from "react";

import { RotateCcwIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { TimelineChart, type TimelineEvent } from "#timeline-chart/index.ts";

const MOMENTS: ReadonlyArray<{
  at: string;
  color?: TimelineEvent["color"];
  kind: string;
  lane: string;
  version?: string;
}> = [
  { at: "09:12", kind: "deploy", lane: "api", version: "4.12" },
  { at: "10:05", kind: "deploy", lane: "web", version: "2.8" },
  { at: "13:20", kind: "deploy", lane: "web", version: "2.9" },
  { at: "14:03", color: "warning", kind: "latency", lane: "api" },
  { at: "14:05", color: "error", kind: "errors", lane: "api" },
  { at: "16:05", kind: "rollback", lane: "api", version: "4.11" },
  { at: "20:55", kind: "deploy", lane: "web", version: "2.9.1" },
];

export function Replay(): ReactElement {
  const { i18n, t } = useWords("timeline-chart");
  const [run, setRun] = useState(0);

  return (
    <Stack align="flex-start">
      <TimelineChart
        animate
        caption={t("replay.caption")}
        events={MOMENTS.map((moment, index) => ({
          at: `2026-09-28T${moment.at}:00Z`,
          color: moment.color,
          key: String(index),
          label: t(`deploys.${moment.kind}`, { version: moment.version }),
          lane: moment.lane,
        }))}
        key={run}
        label={t("replay.label")}
        labelOptions={{ hour: "2-digit", hourCycle: "h23", minute: "2-digit", timeZone: "UTC" }}
        lanes={[
          { key: "api", label: t("deploys.api") },
          { key: "web", label: t("deploys.web") },
        ]}
        locale={i18n.language}
        since="2026-09-28T00:00:00Z"
        until="2026-09-29T00:00:00Z"
      />
      <Button
        onClick={() => {
          setRun(run + 1);
        }}
        size="sm"
        variant="outline"
      >
        <RotateCcwIcon />
        {t("replay.replay")}
      </Button>
    </Stack>
  );
}
