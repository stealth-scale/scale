import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as RadioGroup from "#radio-group/index.ts";

const PERIODS = ["monthly", "yearly", "biennial"] as const;

export function Billing(): ReactElement {
  const { t } = useWords("radio-group");

  return (
    <RadioGroup.Root defaultValue="yearly" name="billing" orientation="horizontal">
      <RadioGroup.Label>{t("billing")}</RadioGroup.Label>
      {PERIODS.map((period) => (
        <RadioGroup.Item key={period} value={period}>
          <RadioGroup.ItemControl />
          <RadioGroup.ItemText>{t(`periods.${period}`)}</RadioGroup.ItemText>
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
}
