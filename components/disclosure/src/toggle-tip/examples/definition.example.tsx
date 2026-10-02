import { type ReactElement } from "react";

import { InfoIcon } from "lucide-react";

import { ButtonPropsProvider, IconButton } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { Portal } from "@stealthscale/component-primitives";
import { Span } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as ToggleTip from "#toggle-tip/index.ts";

export function Definition(props: ToggleTip.RootProps): ReactElement {
  const { t } = useWords("toggle-tip");

  return (
    <Stack direction="row" gap="xs">
      <Span weight="medium">{t("definition.label")}</Span>
      <ToggleTip.Root {...props}>
        <ButtonPropsProvider value={{ size: "xs", variant: "ghost" }}>
          <ToggleTip.Trigger aria-label={t("definition.trigger")} as={IconButton}>
            <InfoIcon />
          </ToggleTip.Trigger>
        </ButtonPropsProvider>
        <Portal>
          <ToggleTip.Positioner>
            <ToggleTip.Content>
              <ToggleTip.Arrow>
                <ToggleTip.ArrowTip />
              </ToggleTip.Arrow>
              {t("definition.tip")}
            </ToggleTip.Content>
          </ToggleTip.Positioner>
        </Portal>
      </ToggleTip.Root>
    </Stack>
  );
}
