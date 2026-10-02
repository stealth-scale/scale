import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as RadioCard from "#radio-card/index.ts";

const CYCLES = ["monthly", "yearly"] as const;

export function Billing(): ReactElement {
  const { t } = useWords("radio-card");

  return (
    <RadioCard.Root align="center" defaultValue="yearly" layout="stacked" orientation="horizontal">
      <RadioCard.Label>{t("cycle")}</RadioCard.Label>
      {CYCLES.map((cycle) => (
        <RadioCard.Item key={cycle} value={cycle}>
          <RadioCard.ItemContent>
            <RadioCard.ItemIndicator />
            <RadioCard.ItemText>{t(`cycles.${cycle}.title`)}</RadioCard.ItemText>
            <RadioCard.ItemDescription>{t(`cycles.${cycle}.price`)}</RadioCard.ItemDescription>
          </RadioCard.ItemContent>
          <RadioCard.ItemAddon>{t(`cycles.${cycle}.note`)}</RadioCard.ItemAddon>
        </RadioCard.Item>
      ))}
    </RadioCard.Root>
  );
}
