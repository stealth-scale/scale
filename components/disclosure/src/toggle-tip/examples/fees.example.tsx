import { type ReactElement } from "react";

import { InfoIcon } from "lucide-react";

import { ButtonPropsProvider, IconButton } from "@stealthscale/component-actions";
import { DataList } from "@stealthscale/component-collections";
import { Portal } from "@stealthscale/component-primitives";
import { useWords } from "@stealthscale/specimen";

import * as ToggleTip from "#toggle-tip/index.ts";

const FEES = ["processing", "payout", "conversion"] as const;

export function Fees(): ReactElement {
  const { t } = useWords("toggle-tip");

  return (
    <ButtonPropsProvider value={{ size: "xs", variant: "ghost" }}>
      <DataList.Root orientation="horizontal">
        {FEES.map((fee) => (
          <DataList.Item key={fee}>
            <DataList.ItemLabel>
              {t(`fees.${fee}.label`)}
              <ToggleTip.Root>
                <ToggleTip.Trigger aria-label={t(`fees.${fee}.trigger`)} as={IconButton}>
                  <InfoIcon />
                </ToggleTip.Trigger>
                <Portal>
                  <ToggleTip.Positioner>
                    <ToggleTip.Content>
                      <ToggleTip.Arrow>
                        <ToggleTip.ArrowTip />
                      </ToggleTip.Arrow>
                      {t(`fees.${fee}.tip`)}
                    </ToggleTip.Content>
                  </ToggleTip.Positioner>
                </Portal>
              </ToggleTip.Root>
            </DataList.ItemLabel>
            <DataList.ItemValue>{t(`fees.${fee}.value`)}</DataList.ItemValue>
          </DataList.Item>
        ))}
      </DataList.Root>
    </ButtonPropsProvider>
  );
}
