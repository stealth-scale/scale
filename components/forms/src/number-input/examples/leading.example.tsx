import { type ReactElement } from "react";

import { MoveHorizontalIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as NumberInput from "#number-input/index.ts";

export function Leading(): ReactElement {
  const { t } = useWords("number-input");

  return (
    <NumberInput.Root
      defaultValue="1.5"
      formatOptions={{ maximumFractionDigits: 2 }}
      max={3}
      min={1}
      step={0.05}
    >
      <NumberInput.Scrubber>
        <MoveHorizontalIcon />
      </NumberInput.Scrubber>
      <NumberInput.Input aria-label={t("leading")} />
    </NumberInput.Root>
  );
}
