import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { StreamGraph } from "#stream-graph/index.ts";

const WEEKS = [
  [42, 18, 4, 0, 6],
  [43, 18, 5, 0, 7],
  [45, 19, 5, 0, 6],
  [44, 19, 6, 1, 7],
  [46, 20, 12, 1, 7],
  [47, 19, 26, 2, 8],
  [48, 20, 38, 3, 7],
  [47, 21, 31, 5, 8],
  [49, 21, 19, 8, 8],
  [50, 20, 11, 11, 9],
  [51, 21, 8, 14, 8],
  [52, 22, 7, 16, 9],
  [51, 22, 6, 18, 9],
  [53, 23, 6, 19, 10],
  [54, 22, 5, 21, 9],
  [55, 23, 5, 22, 10],
].map(([organic = 0, direct = 0, social = 0, email = 0, referral = 0], index) => ({
  direct: direct * 1000,
  email: email * 1000,
  organic: organic * 1000,
  referral: referral * 1000,
  social: social * 1000,
  week: new Date(Date.UTC(2026, 5, 8 + index * 7)).toISOString().slice(0, 10),
}));

export function Ordered(): ReactElement {
  const { t } = useWords("stream-graph");

  return (
    <StreamGraph
      caption={t("ordered.caption")}
      categoryKey="week"
      data={WEEKS}
      insideOut={false}
      label={t("traffic.label")}
      labelOptions={{ day: "numeric", month: "short", timeZone: "UTC" }}
      legendLabel={t("traffic.sources")}
      series={[
        { key: "organic", label: t("traffic.organic") },
        { key: "direct", label: t("traffic.direct") },
        { key: "social", label: t("traffic.social") },
        { key: "email", label: t("traffic.email") },
        { key: "referral", label: t("traffic.referral") },
      ]}
      valueOptions={{ notation: "compact" }}
    />
  );
}
