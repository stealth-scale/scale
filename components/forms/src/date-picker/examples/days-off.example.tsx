import { type ReactElement } from "react";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as DatePicker from "#date-picker/index.ts";

export function DaysOff(): ReactElement {
  const { t } = useWords("date-picker");

  return (
    <DatePicker.Root
      closeOnSelect={false}
      defaultFocusedValue={DatePicker.parseDate("2026-12-01")}
      inline
      maxSelectedDates={5}
      maxView="day"
      selectionMode="multiple"
    >
      <Stack align="flex-start" gap="md">
        <DatePicker.Label>{t("daysOff.label")}</DatePicker.Label>
        <DatePicker.Content>
          <DatePicker.View view="day">
            <DatePicker.Header nextIcon={<ChevronRightIcon />} previousIcon={<ChevronLeftIcon />} />
            <DatePicker.DayTable />
          </DatePicker.View>
        </DatePicker.Content>
        <Text as="output">
          <DatePicker.ValueText placeholder={t("daysOff.none")} />
        </Text>
      </Stack>
    </DatePicker.Root>
  );
}
