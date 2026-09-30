import { type ReactElement, useState } from "react";

import { CircleAlertIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as DateInput from "#date-input/index.ts";
import * as Field from "#field/index.ts";

export function BirthDate(): ReactElement {
  const { t } = useWords("date-input");
  const [fault, setFault] = useState<"adult" | "missing" | undefined>();
  const [sent, setSent] = useState("");
  const today = DateInput.today(DateInput.getLocalTimeZone());

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();

        const submitted = new FormData(event.currentTarget).get("birthDate");
        const born =
          typeof submitted === "string" && submitted !== ""
            ? DateInput.parseDate(submitted)
            : undefined;
        const found =
          born === undefined
            ? "missing"
            : born.compare(today.subtract({ years: 18 })) > 0
              ? "adult"
              : undefined;

        setFault(found);
        setSent(found === undefined ? (born?.toString() ?? "") : "");
      }}
    >
      <Stack align="flex-start" gap="lg">
        <Field.Root invalid={fault !== undefined} required>
          <Field.Label>{t("birth.label")}</Field.Label>
          <DateInput.Root max={today} name="birthDate">
            <DateInput.Control>
              <DateInput.Segments />
            </DateInput.Control>
          </DateInput.Root>
          <Field.HelperText>{t("birth.help")}</Field.HelperText>
          <Field.ErrorText>
            <CircleAlertIcon />
            {t(`birth.${fault ?? "missing"}`)}
          </Field.ErrorText>
        </Field.Root>
        <Button type="submit">{t("birth.submit")}</Button>
        <Text as="output">{sent === "" ? null : t("birth.sent", { date: sent })}</Text>
      </Stack>
    </form>
  );
}
