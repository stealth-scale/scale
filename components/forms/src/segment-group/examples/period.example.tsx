import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as SegmentGroup from "#segment-group/index.ts";

const PERIODS = ["week", "month", "quarter"] as const;

export function Period(props: SegmentGroup.RootProps): ReactElement {
  const { t } = useWords("segment-group");

  return (
    <SegmentGroup.Root aria-label={t("period")} defaultValue="month" {...props}>
      {PERIODS.map((period) => (
        <SegmentGroup.Item key={period} value={period}>
          <SegmentGroup.ItemText>{t(`periods.${period}`)}</SegmentGroup.ItemText>
        </SegmentGroup.Item>
      ))}
    </SegmentGroup.Root>
  );
}
