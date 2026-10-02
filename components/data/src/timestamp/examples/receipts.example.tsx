import { type ReactElement } from "react";

import { DataList } from "@stealthscale/component-collections";
import { useWords } from "@stealthscale/specimen";

import { Timestamp } from "#timestamp/index.ts";

const ORDERED = "2026-07-25T12:15:00Z";

const FORMS: ReadonlyArray<{ key: string; options: Intl.DateTimeFormatOptions }> = [
  { key: "list", options: { timeStyle: "short", timeZone: "Europe/Amsterdam" } },
  {
    key: "invoice",
    options: { day: "numeric", month: "long", timeZone: "Europe/Amsterdam", year: "numeric" },
  },
  {
    key: "audit",
    options: { dateStyle: "full", timeStyle: "medium", timeZone: "Europe/Amsterdam" },
  },
];

export function Receipts(): ReactElement {
  const { t } = useWords("timestamp");

  return (
    <DataList.Root orientation="horizontal">
      {FORMS.map(({ key, options }) => (
        <DataList.Item key={key}>
          <DataList.ItemLabel>{t(`receipts.${key}`)}</DataList.ItemLabel>
          <DataList.ItemValue>
            <Timestamp options={options} value={ORDERED} />
          </DataList.ItemValue>
        </DataList.Item>
      ))}
    </DataList.Root>
  );
}
