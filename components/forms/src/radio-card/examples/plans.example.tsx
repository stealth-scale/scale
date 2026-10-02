import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as RadioCard from "#radio-card/index.ts";

const PLANS = ["starter", "team", "enterprise"] as const;

export function Plans(): ReactElement {
  const { t } = useWords("radio-card");

  return (
    <RadioCard.Root defaultValue="team" name="plan">
      <RadioCard.Label>{t("plan")}</RadioCard.Label>
      {PLANS.map((plan) => (
        <RadioCard.Item disabled={plan === "enterprise"} key={plan} value={plan}>
          <RadioCard.ItemContent>
            <RadioCard.ItemText>{t(`plans.${plan}.title`)}</RadioCard.ItemText>
            <RadioCard.ItemDescription>{t(`plans.${plan}.about`)}</RadioCard.ItemDescription>
            <RadioCard.ItemIndicator />
          </RadioCard.ItemContent>
        </RadioCard.Item>
      ))}
    </RadioCard.Root>
  );
}
