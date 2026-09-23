import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as InputGroup from "#input-group/index.ts";

export function Price(props: InputGroup.FieldProps): ReactElement {
  const { t } = useWords("input-group");

  return (
    <InputGroup.Root>
      <InputGroup.Mark aria-hidden>€</InputGroup.Mark>
      <InputGroup.Field
        aria-label={t("price")}
        defaultValue="49.00"
        inputMode="decimal"
        {...props}
      />
      <InputGroup.Mark aria-hidden>EUR</InputGroup.Mark>
    </InputGroup.Root>
  );
}
