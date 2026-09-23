import { type ReactElement } from "react";

import { CheckIcon, CopyIcon } from "lucide-react";

import { Input, InputPropsProvider } from "@stealthscale/component-forms";
import { useWords } from "@stealthscale/specimen";

import { ButtonPropsProvider, IconButton } from "#button/index.ts";
import * as Clipboard from "#clipboard/index.ts";

export function Beside(): ReactElement {
  const { t } = useWords("clipboard");

  return (
    <Clipboard.Root value="https://stealthscale.io/payouts/4109">
      <Clipboard.Label>{t("label")}</Clipboard.Label>
      <Clipboard.Control>
        <InputPropsProvider value={{ size: "sm" }}>
          <Clipboard.Input as={Input} />
        </InputPropsProvider>
        <ButtonPropsProvider value={{ size: "sm", variant: "ghost" }}>
          <Clipboard.Trigger as={IconButton}>
            <Clipboard.Indicator copied={<CheckIcon size="1em" />}>
              <CopyIcon size="1em" />
            </Clipboard.Indicator>
          </Clipboard.Trigger>
        </ButtonPropsProvider>
      </Clipboard.Control>
    </Clipboard.Root>
  );
}
