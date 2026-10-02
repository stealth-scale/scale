import { type ReactElement } from "react";

import { CheckIcon, CopyIcon } from "lucide-react";

import { Input, InputPropsProvider } from "@stealthscale/component-forms";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { ButtonPropsProvider, IconButton } from "#button/index.ts";
import * as Clipboard from "#clipboard/index.ts";

const SIZES = ["sm", "md", "lg"] as const;

export function Sizes(): ReactElement {
  const { t } = useWords("clipboard");

  return (
    <Stack direction="column" gap="lg">
      {SIZES.map((size) => (
        <Clipboard.Root key={size} size={size} value="https://stealthscale.io/payouts/4109">
          <Clipboard.Label>{t("label")}</Clipboard.Label>
          <Clipboard.Control>
            <InputPropsProvider value={{ size }}>
              <Clipboard.Input as={Input} />
            </InputPropsProvider>
            <ButtonPropsProvider value={{ size, variant: "outline" }}>
              <Clipboard.Trigger as={IconButton}>
                <Clipboard.Indicator copied={<CheckIcon size="1em" />}>
                  <CopyIcon size="1em" />
                </Clipboard.Indicator>
              </Clipboard.Trigger>
            </ButtonPropsProvider>
          </Clipboard.Control>
        </Clipboard.Root>
      ))}
    </Stack>
  );
}
