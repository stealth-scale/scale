import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as SegmentGroup from "#segment-group/index.ts";

const RANGES = ["day", "week", "month", "year"] as const;

export function Range(): ReactElement {
  const { t } = useWords("segment-group");

  return (
    <SegmentGroup.Root aria-label={t("range")} defaultValue="week">
      {RANGES.map((range) => (
        <SegmentGroup.Item disabled={range === "year"} key={range} value={range}>
          <SegmentGroup.ItemText>{t(`ranges.${range}`)}</SegmentGroup.ItemText>
        </SegmentGroup.Item>
      ))}
    </SegmentGroup.Root>
  );
}
