import { type ReactElement, useState } from "react";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as DatePicker from "#date-picker/index.ts";

const BOOKED = new Set(["2026-10-09", "2026-10-10", "2026-10-11", "2026-10-23", "2026-10-24"]);

export function Availability(): ReactElement {
  const { t } = useWords("date-picker");
  const [value, setValue] = useState<DatePicker.DateValue[]>([]);
  const [start, end] = value;

  return (
    <DatePicker.Root
      defaultFocusedValue={DatePicker.parseDate("2026-10-01")}
      inline
      isDateUnavailable={(date) => BOOKED.has(date.toString())}
      maxView="day"
      numOfMonths={2}
      onValueChange={({ value: next }) => {
        setValue(next);
      }}
      selectionMode="range"
      value={value}
    >
      <Stack align="flex-start" gap="md">
        <DatePicker.Label>{t("availability.label")}</DatePicker.Label>
        <DatePicker.Content>
          <DatePicker.View view="day">
            <DatePicker.Header nextIcon={<ChevronRightIcon />} previousIcon={<ChevronLeftIcon />} />
            <Stack align="flex-start" direction="row" gap="lg" justify="center" wrap>
              <DatePicker.DayTable />
              <DatePicker.DayTable offset={1} />
            </Stack>
          </DatePicker.View>
        </DatePicker.Content>
        <Text as="output">
          {start === undefined || end === undefined
            ? t("availability.pick")
            : t("availability.nights", { count: end.compare(start) })}
        </Text>
      </Stack>
    </DatePicker.Root>
  );
}
