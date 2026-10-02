import { type ReactElement } from "react";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as DatePicker from "#date-picker/index.ts";

export function Billing(): ReactElement {
  const { t } = useWords("date-picker");

  return (
    <DatePicker.Root
      defaultValue={[DatePicker.parseDate("2026-10-01")]}
      defaultView="month"
      format={(date, { locale, timeZone }) =>
        date.toDate(timeZone).toLocaleDateString(locale, { month: "long", year: "numeric" })
      }
      inline
      minView="month"
      name="billing"
    >
      <Stack align="flex-start" gap="md">
        <DatePicker.Label>{t("billing.label")}</DatePicker.Label>
        <DatePicker.Content>
          <DatePicker.View view="month">
            <DatePicker.Header nextIcon={<ChevronRightIcon />} previousIcon={<ChevronLeftIcon />} />
            <DatePicker.MonthTable />
          </DatePicker.View>
          <DatePicker.View view="year">
            <DatePicker.Header nextIcon={<ChevronRightIcon />} previousIcon={<ChevronLeftIcon />} />
            <DatePicker.YearTable />
          </DatePicker.View>
        </DatePicker.Content>
        <Text as="output">
          <DatePicker.ValueText placeholder={t("billing.none")} />
        </Text>
      </Stack>
    </DatePicker.Root>
  );
}
