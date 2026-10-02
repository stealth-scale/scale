import { type ReactElement } from "react";

import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as SegmentGroup from "#segment-group/index.ts";

const ALIGNMENTS = [
  { Icon: AlignLeftIcon, value: "left" },
  { Icon: AlignCenterIcon, value: "center" },
  { Icon: AlignRightIcon, value: "right" },
] as const;

export function Alignment(props: SegmentGroup.RootProps): ReactElement {
  const { t } = useWords("segment-group");

  return (
    <SegmentGroup.Root aria-label={t("alignment")} defaultValue="left" {...props}>
      {ALIGNMENTS.map(({ Icon, value }) => (
        <SegmentGroup.Item key={value} value={value}>
          <Icon aria-hidden />
          <SegmentGroup.ItemText>{t(`alignments.${value}`)}</SegmentGroup.ItemText>
        </SegmentGroup.Item>
      ))}
    </SegmentGroup.Root>
  );
}
