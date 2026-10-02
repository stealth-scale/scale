import { type ReactElement } from "react";

import { MinusIcon, PlusIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as NumberInput from "#number-input/index.ts";

export function Seats(props: NumberInput.RootProps): ReactElement {
  const { t } = useWords("number-input");

  return (
    <NumberInput.Root defaultValue="4" max={50} min={1} {...props}>
      <NumberInput.DecrementTrigger label={t("fewer")}>
        <MinusIcon />
      </NumberInput.DecrementTrigger>
      <NumberInput.Input aria-label={t("seats")} />
      <NumberInput.IncrementTrigger label={t("more")}>
        <PlusIcon />
      </NumberInput.IncrementTrigger>
    </NumberInput.Root>
  );
}
