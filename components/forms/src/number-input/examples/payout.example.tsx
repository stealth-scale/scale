import { type ReactElement } from "react";

import { MinusIcon, PlusIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Field from "#field/index.ts";
import * as NumberInput from "#number-input/index.ts";

export function Payout(): ReactElement {
  const { t } = useWords("number-input");

  return (
    <Field.Root>
      <Field.Label>{t("payout")}</Field.Label>
      <NumberInput.Root
        defaultValue="1250"
        formatOptions={{ currency: "EUR", style: "currency" }}
        locale="en-GB"
        min={0}
        step={50}
      >
        <NumberInput.DecrementTrigger label={t("less")}>
          <MinusIcon />
        </NumberInput.DecrementTrigger>
        <NumberInput.Input />
        <NumberInput.IncrementTrigger label={t("add")}>
          <PlusIcon />
        </NumberInput.IncrementTrigger>
      </NumberInput.Root>
      <Field.HelperText>{t("paid")}</Field.HelperText>
    </Field.Root>
  );
}
