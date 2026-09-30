import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as RadioCard from "#radio-card/index.ts";

const SPEEDS = ["standard", "next", "same"] as const;

export function Speeds(props: RadioCard.RootProps): ReactElement {
  const { t } = useWords("radio-card");

  return (
    <RadioCard.Root defaultValue="next" orientation="horizontal" {...props}>
      <RadioCard.Label>{t("speed")}</RadioCard.Label>
      {SPEEDS.map((speed) => (
        <RadioCard.Item key={speed} value={speed}>
          <RadioCard.ItemContent>
            <RadioCard.ItemText>{t(`speeds.${speed}.title`)}</RadioCard.ItemText>
            <RadioCard.ItemDescription>{t(`speeds.${speed}.about`)}</RadioCard.ItemDescription>
            <RadioCard.ItemIndicator />
          </RadioCard.ItemContent>
          <RadioCard.ItemAddon>{t(`speeds.${speed}.price`)}</RadioCard.ItemAddon>
        </RadioCard.Item>
      ))}
    </RadioCard.Root>
  );
}
