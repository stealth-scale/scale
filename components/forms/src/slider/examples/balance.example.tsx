import { type ReactElement, useState } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Slider from "#slider/index.ts";

export function Balance(): ReactElement {
  const { t } = useWords("slider");
  const [balance, setBalance] = useState([0]);
  const [offset = 0] = balance;
  const side = (value: number): string =>
    value === 0 ? t("centre") : t(value < 0 ? "left" : "right", { amount: Math.abs(value) });

  return (
    <Slider.Root
      getAriaValueText={({ value }) => side(value)}
      max={50}
      min={-50}
      onValueChange={({ value }) => {
        setBalance(value);
      }}
      origin="center"
      value={balance}
    >
      <Slider.Label>{t("balance")}</Slider.Label>
      <Slider.ValueText>{side(offset)}</Slider.ValueText>
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumb />
      </Slider.Control>
    </Slider.Root>
  );
}
