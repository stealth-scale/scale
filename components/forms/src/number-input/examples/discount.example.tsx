import { type ReactElement } from "react";

import { MinusIcon, PlusIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Field from "#field/index.ts";
import * as NumberInput from "#number-input/index.ts";

export function Discount(): ReactElement {
  const { t } = useWords("number-input");

  return (
    <Field.Root>
      <Field.Label>{t("discount")}</Field.Label>
      <NumberInput.Root
        defaultValue="15%"
        formatOptions={{ maximumFractionDigits: 0, style: "percent" }}
        max={0.5}
        min={0}
        step={0.05}
      >
        <NumberInput.DecrementTrigger label={t("lower")}>
          <MinusIcon />
        </NumberInput.DecrementTrigger>
        <NumberInput.Input />
        <NumberInput.IncrementTrigger label={t("raise")}>
          <PlusIcon />
        </NumberInput.IncrementTrigger>
      </NumberInput.Root>
      <Field.HelperText>{t("capped")}</Field.HelperText>
    </Field.Root>
  );
}
