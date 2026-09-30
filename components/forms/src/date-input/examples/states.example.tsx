import { type ReactElement } from "react";

import { XIcon } from "lucide-react";

import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as DateInput from "#date-input/index.ts";

const STATES = ["disabled", "readOnly", "invalid"] as const;

export function States(): ReactElement {
  const { t } = useWords("date-input");

  return (
    <Stack gap="md">
      {STATES.map((state) => (
        <DateInput.Root
          defaultValue={[DateInput.parseDate("2026-10-14")]}
          disabled={state === "disabled"}
          invalid={state === "invalid"}
          key={state}
          readOnly={state === "readOnly"}
        >
          <DateInput.Label>{t(`states.${state}`)}</DateInput.Label>
          <DateInput.Control>
            <DateInput.Segments />
            <DateInput.ClearTrigger label={t("appointment.clear")}>
              <XIcon />
            </DateInput.ClearTrigger>
          </DateInput.Control>
        </DateInput.Root>
      ))}
    </Stack>
  );
}
