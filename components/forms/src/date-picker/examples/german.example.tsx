import { type ReactElement } from "react";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as DatePicker from "#date-picker/index.ts";

export function German(): ReactElement {
  const { t } = useWords("date-picker");

  return (
    <DatePicker.Root
      defaultValue={[DatePicker.parseDate("2026-10-14")]}
      inline
      locale="de-DE"
      maxView="day"
      showWeekNumbers
      startOfWeek={1}
    >
      <DatePicker.Label>{t("german.label")}</DatePicker.Label>
      <DatePicker.Content>
        <DatePicker.View view="day">
          <DatePicker.Header
            nextIcon={<ChevronRightIcon />}
            nextLabel={t("german.next")}
            previousIcon={<ChevronLeftIcon />}
            previousLabel={t("german.previous")}
          />
          <DatePicker.DayTable weekLabel={t("german.week")} />
        </DatePicker.View>
      </DatePicker.Content>
    </DatePicker.Root>
  );
}
