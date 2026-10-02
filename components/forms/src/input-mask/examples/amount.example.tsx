import { type ReactElement, useState } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Field from "#field/index.ts";
import * as InputGroup from "#input-group/index.ts";
import * as InputMask from "#input-mask/index.ts";

const FEE = 2.5;

const MONEY = new Intl.NumberFormat("nl-NL", { currency: "EUR", style: "currency" });

export function Amount(): ReactElement {
  const { t } = useWords("input-mask");
  const [amount, setAmount] = useState({ unmasked: "1250.00", value: "1.250,00" });

  return (
    <Field.Root>
      <Field.Label>{t("amount")}</Field.Label>
      <InputMask.Root
        number={{ fraction: 2, locale: "nl-NL", unsigned: true }}
        onValueChange={({ unmasked, value }) => {
          setAmount({ unmasked, value });
        }}
        value={amount.value}
      >
        <InputGroup.Mark aria-hidden>€</InputGroup.Mark>
        <InputMask.Input />
      </InputMask.Root>
      <Field.HelperText>
        {amount.unmasked === ""
          ? t("noAmount")
          : t("receives", {
              fee: MONEY.format(FEE),
              received: MONEY.format(Math.max(Number(amount.unmasked) - FEE, 0)),
            })}
      </Field.HelperText>
    </Field.Root>
  );
}
