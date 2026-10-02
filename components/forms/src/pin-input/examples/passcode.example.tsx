import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as PinInput from "#pin-input/index.ts";

const PLACES = [0, 1, 2, 3];

export function Passcode(): ReactElement {
  const { t } = useWords("pin-input");

  return (
    <PinInput.Root attached count={4} defaultValue={["2", "0", "4", "8"]} mask>
      <PinInput.Label>{t("passcode")}</PinInput.Label>
      <PinInput.Control>
        {PLACES.map((index) => (
          <PinInput.Input index={index} key={index} label={t("digit4", { place: index + 1 })} />
        ))}
      </PinInput.Control>
    </PinInput.Root>
  );
}
