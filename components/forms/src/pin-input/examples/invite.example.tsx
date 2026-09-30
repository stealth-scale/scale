import { type ReactElement } from "react";

import { MinusIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as PinInput from "#pin-input/index.ts";

const FIRST = [0, 1, 2];

const SECOND = [3, 4, 5];

export function Invite(): ReactElement {
  const { t } = useWords("pin-input");

  return (
    <PinInput.Root
      count={6}
      sanitizeValue={(value) => value.replaceAll("-", "")}
      type="alphanumeric"
    >
      <PinInput.Label>{t("invite")}</PinInput.Label>
      <PinInput.Control>
        {FIRST.map((index) => (
          <PinInput.Input index={index} key={index} label={t("character6", { place: index + 1 })} />
        ))}
        <MinusIcon aria-hidden />
        {SECOND.map((index) => (
          <PinInput.Input index={index} key={index} label={t("character6", { place: index + 1 })} />
        ))}
      </PinInput.Control>
    </PinInput.Root>
  );
}
