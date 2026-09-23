import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as InputGroup from "#input-group/index.ts";

export function Rate(props: InputGroup.AddonProps): ReactElement {
  const { t } = useWords("input-group");

  return (
    <InputGroup.Root>
      <InputGroup.Mark aria-hidden>€</InputGroup.Mark>
      <InputGroup.Field aria-label={t("rate")} defaultValue="85.00" inputMode="decimal" />
      <InputGroup.Addon {...props}>{t("hourly")}</InputGroup.Addon>
    </InputGroup.Root>
  );
}
