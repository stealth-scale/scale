import { type ReactElement, useState } from "react";

import { CreditCardIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as InputGroup from "#input-group/index.ts";

function spaced(typed: string): string {
  return typed
    .replaceAll(/\D/gu, "")
    .slice(0, 16)
    .replaceAll(/(\d{4})(?=\d)/gu, "$1 ");
}

export function CardNumber(): ReactElement {
  const { t } = useWords("input-group");
  const [number, setNumber] = useState(spaced("4242424242424242"));

  return (
    <InputGroup.Root>
      <InputGroup.Mark aria-hidden>
        <CreditCardIcon />
      </InputGroup.Mark>
      <InputGroup.Field
        aria-label={t("number")}
        autoComplete="cc-number"
        inputMode="numeric"
        onChange={(event) => {
          setNumber(spaced(event.target.value));
        }}
        placeholder="1234 1234 1234 1234"
        value={number}
      />
    </InputGroup.Root>
  );
}
