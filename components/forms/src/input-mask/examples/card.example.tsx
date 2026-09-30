import { type ReactElement } from "react";

import { CreditCardIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Field from "#field/index.ts";
import * as InputGroup from "#input-group/index.ts";
import * as InputMask from "#input-mask/index.ts";

const AMEX = "9999 999999 99999";

const CARD = "9999 9999 9999 9999";

function patternOf(value: string): string {
  return /^3[47]/u.test(value.replaceAll(/\D/gu, "")) ? AMEX : CARD;
}

export function Card(props: InputMask.RootProps): ReactElement {
  const { t } = useWords("input-mask");

  return (
    <Field.Root>
      <Field.Label>{t("card")}</Field.Label>
      <InputMask.Root mask={patternOf} {...props}>
        <InputGroup.Mark aria-hidden>
          <CreditCardIcon />
        </InputGroup.Mark>
        <InputMask.Input autoComplete="cc-number" inputMode="numeric" />
      </InputMask.Root>
      <Field.HelperText>{t("grouped")}</Field.HelperText>
    </Field.Root>
  );
}
