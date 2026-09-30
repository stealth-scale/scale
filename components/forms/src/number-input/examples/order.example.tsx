import { type ReactElement, useState } from "react";

import { MinusIcon, PlusIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Field from "#field/index.ts";
import * as NumberInput from "#number-input/index.ts";

const PRICE = 12;

const MONEY = new Intl.NumberFormat("en-GB", { currency: "EUR", style: "currency" });

export function Order(): ReactElement {
  const { t } = useWords("number-input");
  const [quantity, setQuantity] = useState("2");

  return (
    <Field.Root>
      <Field.Label>{t("licences")}</Field.Label>
      <NumberInput.Root
        max={25}
        min={1}
        onValueChange={({ value }) => {
          setQuantity(value);
        }}
        value={quantity}
      >
        <NumberInput.DecrementTrigger label={t("fewerLicences")}>
          <MinusIcon />
        </NumberInput.DecrementTrigger>
        <NumberInput.Input />
        <NumberInput.IncrementTrigger label={t("moreLicences")}>
          <PlusIcon />
        </NumberInput.IncrementTrigger>
      </NumberInput.Root>
      <Field.HelperText>
        {quantity === ""
          ? t("noTotal")
          : t("total", { total: MONEY.format(Math.trunc(Number(quantity)) * PRICE) })}
      </Field.HelperText>
    </Field.Root>
  );
}
