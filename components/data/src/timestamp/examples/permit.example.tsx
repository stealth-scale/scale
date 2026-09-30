import { type ReactElement } from "react";

import { DataList } from "@stealthscale/component-collections";
import { useWords } from "@stealthscale/specimen";

import { Timestamp } from "#timestamp/index.ts";

const NOW = new Date("2026-07-25T14:30:00Z");

const DUTCH: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "long",
  timeZone: "Europe/Amsterdam",
  year: "numeric",
};

const STEPS = [
  { at: NOW.getTime() - 14_400_000, key: "sent", reads: "relative" },
  { at: NOW.getTime() - 86_400_000, key: "granted", reads: "relative" },
  { at: Date.parse("2026-06-12T10:00:00Z"), key: "received", reads: "absolute" },
] as const;

export function Permit(): ReactElement {
  const { t } = useWords("timestamp");

  return (
    <DataList.Root lang="nl" orientation="horizontal">
      {STEPS.map(({ at, key, reads }) => (
        <DataList.Item key={key}>
          <DataList.ItemLabel>{t(`permit.steps.${key}`)}</DataList.ItemLabel>
          <DataList.ItemValue>
            <Timestamp locale="nl-NL" now={NOW} options={DUTCH} reads={reads} value={at} />
          </DataList.ItemValue>
        </DataList.Item>
      ))}
    </DataList.Root>
  );
}
