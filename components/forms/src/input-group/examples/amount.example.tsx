import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as InputGroup from "#input-group/index.ts";

export function Amount(props: InputGroup.RootProps): ReactElement {
  const { t } = useWords("input-group");

  return (
    <InputGroup.Root {...props}>
      <InputGroup.Mark aria-hidden>€</InputGroup.Mark>
      <InputGroup.Field aria-label={t("amount")} defaultValue="250.00" inputMode="decimal" />
    </InputGroup.Root>
  );
}
