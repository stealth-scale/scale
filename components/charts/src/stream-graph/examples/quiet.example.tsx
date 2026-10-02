import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { StreamGraph } from "#stream-graph/index.ts";

const WEEKS: Array<{ direct: number; organic: number; social: number; week: string }> = [];

export function Quiet(): ReactElement {
  const { t } = useWords("stream-graph");

  return (
    <StreamGraph
      caption={t("quiet.caption")}
      categoryKey="week"
      data={WEEKS}
      empty={t("quiet.empty")}
      label={t("traffic.label")}
      legendLabel={t("traffic.sources")}
      series={[
        { key: "organic", label: t("traffic.organic") },
        { key: "direct", label: t("traffic.direct") },
        { key: "social", label: t("traffic.social") },
      ]}
    />
  );
}
