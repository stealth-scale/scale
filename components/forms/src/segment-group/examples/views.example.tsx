import { type ReactElement } from "react";

import { CalendarDaysIcon, KanbanIcon, ListIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as SegmentGroup from "#segment-group/index.ts";

const VIEWS = [
  { Icon: ListIcon, value: "list" },
  { Icon: KanbanIcon, value: "board" },
  { Icon: CalendarDaysIcon, value: "calendar" },
] as const;

export function Views(): ReactElement {
  const { t } = useWords("segment-group");

  return (
    <SegmentGroup.Root aria-label={t("view")} defaultValue="board">
      {VIEWS.map(({ Icon, value }) => (
        <SegmentGroup.Item key={value} value={value}>
          <Icon aria-hidden />
          <SegmentGroup.ItemText>{t(`views.${value}`)}</SegmentGroup.ItemText>
        </SegmentGroup.Item>
      ))}
    </SegmentGroup.Root>
  );
}
