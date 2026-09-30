import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { TimelineChart, type TimelineEvent } from "#timeline-chart/index.ts";

const RELEASES: ReadonlyArray<{
  at: string;
  color?: TimelineEvent["color"];
  kind: "patch" | "release";
  version: string;
}> = [
  { at: "2025-10-14", kind: "release", version: "3.0" },
  { at: "2025-11-18", kind: "release", version: "3.1" },
  { at: "2026-01-20", kind: "release", version: "3.2" },
  { at: "2026-02-24", kind: "release", version: "3.3" },
  { at: "2026-02-26", color: "warning", kind: "patch", version: "3.3.1" },
  { at: "2026-04-07", kind: "release", version: "4.0" },
  { at: "2026-05-12", kind: "release", version: "4.1" },
  { at: "2026-06-16", kind: "release", version: "4.2" },
  { at: "2026-06-19", color: "warning", kind: "patch", version: "4.2.1" },
  { at: "2026-07-21", kind: "release", version: "4.3" },
  { at: "2026-09-01", kind: "release", version: "4.4" },
];

export function Releases(): ReactElement {
  const { i18n, t } = useWords("timeline-chart");

  return (
    <TimelineChart
      caption={t("releases.caption")}
      events={RELEASES.map((release) => ({
        at: `${release.at}T12:00:00Z`,
        color: release.color,
        key: release.version,
        label: t(`releases.${release.kind}`, { version: release.version }),
      }))}
      label={t("releases.label")}
      labelOptions={{ dateStyle: "medium", timeZone: "UTC" }}
      locale={i18n.language}
      since="2025-10-01T00:00:00Z"
      ticks={3}
      until="2026-10-01T00:00:00Z"
    />
  );
}
