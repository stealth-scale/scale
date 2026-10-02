import { type ReactElement } from "react";

import { CheckIcon, CopyIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import { Button, ButtonPropsProvider } from "#button/index.ts";
import * as Clipboard from "#clipboard/index.ts";

export function Alone(props: Clipboard.RootProps): ReactElement {
  const { t } = useWords("clipboard");

  return (
    <Clipboard.Root value="https://stealthscale.io/payouts/4109" {...props}>
      <ButtonPropsProvider value={{ size: "sm", variant: "outline" }}>
        <Clipboard.Trigger as={Button} copiedLabel={t("copied")} label={t("copy")}>
          <Clipboard.Indicator copied={<CheckIcon size="1em" />}>
            <CopyIcon size="1em" />
          </Clipboard.Indicator>
          <Clipboard.Indicator copied={t("copied")}>{t("copy")}</Clipboard.Indicator>
        </Clipboard.Trigger>
      </ButtonPropsProvider>
    </Clipboard.Root>
  );
}
