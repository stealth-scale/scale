import { type ReactElement } from "react";

import { CreditCardIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as InputGroup from "#input-group/index.ts";

export function Payment(): ReactElement {
  const { t } = useWords("input-group");

  return (
    <InputGroup.Root>
      <InputGroup.Row>
        <InputGroup.Mark aria-hidden>
          <CreditCardIcon />
        </InputGroup.Mark>
        <InputGroup.Field
          aria-label={t("number")}
          autoComplete="cc-number"
          inputMode="numeric"
          placeholder="1234 1234 1234 1234"
        />
      </InputGroup.Row>
      <InputGroup.Row>
        <InputGroup.Field
          aria-label={t("month")}
          autoComplete="cc-exp-month"
          inputMode="numeric"
          maxLength={2}
          placeholder="MM"
          size={2}
        />
        <InputGroup.Mark aria-hidden>/</InputGroup.Mark>
        <InputGroup.Field
          aria-label={t("year")}
          autoComplete="cc-exp-year"
          inputMode="numeric"
          maxLength={2}
          placeholder="YY"
          size={2}
        />
        <InputGroup.Field
          aria-label={t("code")}
          autoComplete="cc-csc"
          inputMode="numeric"
          maxLength={4}
          placeholder="CVC"
        />
      </InputGroup.Row>
    </InputGroup.Root>
  );
}
