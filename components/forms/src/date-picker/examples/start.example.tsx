import { type ReactElement, useState } from "react";
import { createPortal } from "react-dom";

import { isWeekend } from "@internationalized/date";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, CircleAlertIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as DatePicker from "#date-picker/index.ts";
import * as Field from "#field/index.ts";

export function Start(): ReactElement {
  const { t } = useWords("date-picker");
  const [fault, setFault] = useState(false);
  const [sent, setSent] = useState("");

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();

        const start = new FormData(event.currentTarget).get("start");
        const ok = typeof start === "string" && start !== "";

        setFault(!ok);
        setSent(ok ? start : "");
      }}
    >
      <Stack align="flex-start" gap="lg">
        <Field.Root invalid={fault} required>
          <Field.Label>{t("start.label")}</Field.Label>
          <DatePicker.Root
            isDateUnavailable={(date, locale) => isWeekend(date, locale)}
            maxView="day"
            min={DatePicker.today(DatePicker.getLocalTimeZone())}
            name="start"
          >
            <DatePicker.Control>
              <DatePicker.Input />
              <DatePicker.Trigger label={t("choose")}>
                <CalendarIcon />
              </DatePicker.Trigger>
            </DatePicker.Control>
            {createPortal(
              <DatePicker.Positioner>
                <DatePicker.Content label={t("choose")}>
                  <DatePicker.View view="day">
                    <DatePicker.Header
                      nextIcon={<ChevronRightIcon />}
                      previousIcon={<ChevronLeftIcon />}
                    />
                    <DatePicker.DayTable />
                  </DatePicker.View>
                </DatePicker.Content>
              </DatePicker.Positioner>,
              document.body,
            )}
          </DatePicker.Root>
          <Field.HelperText>{t("start.help")}</Field.HelperText>
          <Field.ErrorText>
            <CircleAlertIcon />
            {t("start.missing")}
          </Field.ErrorText>
        </Field.Root>
        <Button type="submit">{t("start.submit")}</Button>
        <Text as="output">{sent === "" ? null : t("start.sent", { date: sent })}</Text>
      </Stack>
    </form>
  );
}
