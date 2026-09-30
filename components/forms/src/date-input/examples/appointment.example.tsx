import { type ReactElement } from "react";

import { XIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as DateInput from "#date-input/index.ts";

export function Appointment(props: DateInput.RootProps): ReactElement {
  const { t } = useWords("date-input");

  return (
    <DateInput.Root defaultValue={[DateInput.parseDate("2026-10-14")]} {...props}>
      <DateInput.Label>{t("appointment.label")}</DateInput.Label>
      <DateInput.Control>
        <DateInput.Segments />
        <DateInput.ClearTrigger label={t("appointment.clear")}>
          <XIcon />
        </DateInput.ClearTrigger>
      </DateInput.Control>
    </DateInput.Root>
  );
}
