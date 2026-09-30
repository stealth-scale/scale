import { type ReactElement } from "react";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as DatePicker from "#date-picker/index.ts";

export function Holiday(props: DatePicker.RootProps): ReactElement {
  const { t } = useWords("date-picker");

  return (
    <DatePicker.Root
      defaultValue={[DatePicker.parseDate("2026-12-21"), DatePicker.parseDate("2026-12-27")]}
      inline
      maxView="day"
      selectionMode="range"
      {...props}
    >
      <DatePicker.Label>{t("holiday.label")}</DatePicker.Label>
      <DatePicker.Content>
        <DatePicker.View view="day">
          <DatePicker.Header nextIcon={<ChevronRightIcon />} previousIcon={<ChevronLeftIcon />} />
          <DatePicker.DayTable />
        </DatePicker.View>
      </DatePicker.Content>
    </DatePicker.Root>
  );
}
