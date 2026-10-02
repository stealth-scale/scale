import { type ReactElement } from "react";

import { CheckIcon } from "lucide-react";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Steps from "#steps/index.ts";

const STEPS = ["account", "amount", "confirm"] as const;

export function Payout(props: Steps.RootProps): ReactElement {
  const { t } = useWords("steps");

  return (
    <Steps.Root count={STEPS.length} defaultStep={1} {...props}>
      <Steps.List>
        {STEPS.map((step, index) => (
          <Steps.Item index={index} key={step}>
            <Steps.Trigger>
              <Steps.Indicator>
                <Steps.Status complete={<CheckIcon />} />
              </Steps.Indicator>
              <Steps.Title>{t(`payout.${step}.title`)}</Steps.Title>
            </Steps.Trigger>
            <Steps.Separator />
          </Steps.Item>
        ))}
      </Steps.List>
      {STEPS.map((step, index) => (
        <Steps.Content index={index} key={step}>
          {t(`payout.${step}.body`)}
        </Steps.Content>
      ))}
      <Steps.CompletedContent>{t("payout.queued")}</Steps.CompletedContent>
      <Stack direction="row" gap="sm">
        <ButtonPropsProvider value={{ size: "sm", variant: "outline" }}>
          <Steps.PrevTrigger as={Button}>{t("back")}</Steps.PrevTrigger>
        </ButtonPropsProvider>
        <ButtonPropsProvider value={{ size: "sm" }}>
          <Steps.NextTrigger as={Button}>{t("next")}</Steps.NextTrigger>
        </ButtonPropsProvider>
      </Stack>
    </Steps.Root>
  );
}
