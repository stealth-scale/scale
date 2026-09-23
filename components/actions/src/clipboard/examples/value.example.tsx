import { type ReactElement } from "react";

import { CheckIcon, CopyIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import { Button, ButtonPropsProvider } from "#button/index.ts";
import * as Clipboard from "#clipboard/index.ts";

const LINK = "https://stealthscale.io/payouts/4109";

export function Value(): ReactElement {
  const { t } = useWords("clipboard");

  return (
    <Clipboard.Root value={LINK}>
      <ButtonPropsProvider value={{ size: "sm", variant: "ghost" }}>
        <Clipboard.Trigger
          as={Button}
          copiedLabel={t("copiedValue", { value: LINK })}
          label={t("copyValue", { value: LINK })}
        >
          <Clipboard.ValueText />
          <Clipboard.Indicator copied={<CheckIcon size="1em" />}>
            <CopyIcon size="1em" />
          </Clipboard.Indicator>
        </Clipboard.Trigger>
      </ButtonPropsProvider>
    </Clipboard.Root>
  );
}
