import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Fieldset from "#fieldset/index.ts";
import * as InputGroup from "#input-group/index.ts";

export function Locked(): ReactElement {
  const { t } = useWords("input-group");

  return (
    <Fieldset.Root disabled>
      <Fieldset.Legend>{t("plan")}</Fieldset.Legend>
      <InputGroup.Root>
        <InputGroup.Mark aria-hidden>€</InputGroup.Mark>
        <InputGroup.Field aria-label={t("price")} defaultValue="49.00" inputMode="decimal" />
        <InputGroup.Mark aria-hidden>EUR</InputGroup.Mark>
      </InputGroup.Root>
    </Fieldset.Root>
  );
}
