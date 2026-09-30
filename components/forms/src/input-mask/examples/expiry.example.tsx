import { type ReactElement, useState } from "react";

import { CircleAlertIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Field from "#field/index.ts";
import * as InputMask from "#input-mask/index.ts";

function monthOf(unmasked: string): number {
  return Number(unmasked.slice(0, 2));
}

export function Expiry(): ReactElement {
  const { t } = useWords("input-mask");
  const [wrong, setWrong] = useState(false);

  return (
    <Field.Root invalid={wrong}>
      <Field.Label>{t("expiry")}</Field.Label>
      <InputMask.Root
        eager
        mask="99/99"
        onValueChange={() => {
          setWrong(false);
        }}
        onValueComplete={({ unmasked }) => {
          setWrong(monthOf(unmasked) < 1 || monthOf(unmasked) > 12);
        }}
      >
        <InputMask.Input autoComplete="cc-exp" />
      </InputMask.Root>
      <Field.HelperText>{t("expiryHelp")}</Field.HelperText>
      <Field.ErrorText>
        <CircleAlertIcon />
        {t("month")}
      </Field.ErrorText>
    </Field.Root>
  );
}
