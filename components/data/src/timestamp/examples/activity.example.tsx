import { type ReactElement } from "react";

import { DataList } from "@stealthscale/component-collections";
import { useWords } from "@stealthscale/specimen";

import { Timestamp } from "#timestamp/index.ts";

const NOW = new Date("2026-07-25T14:30:00Z");

const EVENTS = [
  { ago: 30_000, key: "note" },
  { ago: 300_000, key: "timesheet" },
  { ago: 8_100_000, key: "expense" },
  { ago: 86_400_000, key: "leave" },
  { ago: 1_814_400_000, key: "review" },
  { ago: 20_736_000_000, key: "salary" },
  { ago: 63_072_000_000, key: "contract" },
] as const;

export function Activity(): ReactElement {
  const { t } = useWords("timestamp");

  return (
    <DataList.Root orientation="horizontal">
      {EVENTS.map(({ ago, key }) => (
        <DataList.Item key={key}>
          <DataList.ItemLabel>{t(`activity.events.${key}`)}</DataList.ItemLabel>
          <DataList.ItemValue>
            <Timestamp now={NOW} reads="relative" value={NOW.getTime() - ago} />
          </DataList.ItemValue>
        </DataList.Item>
      ))}
    </DataList.Root>
  );
}
