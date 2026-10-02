import { type ReactElement } from "react";

import { CheckIcon } from "lucide-react";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Steps from "#steps/index.ts";

const STEPS = ["profile", "team", "billing"] as const;

export function Setup(): ReactElement {
  const { t } = useWords("steps");

  return (
    <Steps.Root count={STEPS.length} defaultStep={1} orientation="vertical">
      <Steps.List>
        {STEPS.map((step, index) => (
          <Steps.Item index={index} key={step}>
            <Steps.Trigger>
              <Steps.Indicator>
                <Steps.Status complete={<CheckIcon />} />
              </Steps.Indicator>
              <Stack as="span" gap="xs">
                <Steps.Title>{t(`setup.${step}.title`)}</Steps.Title>
                <Steps.Description>{t(`setup.${step}.description`)}</Steps.Description>
              </Stack>
            </Steps.Trigger>
            <Steps.Separator />
          </Steps.Item>
        ))}
      </Steps.List>
      {STEPS.map((step, index) => (
        <Steps.Content index={index} key={step}>
          <Stack align="flex-start" gap="md">
            {t(`setup.${step}.body`)}
            <ButtonPropsProvider value={{ size: "sm" }}>
              <Steps.NextTrigger as={Button}>{t("next")}</Steps.NextTrigger>
            </ButtonPropsProvider>
          </Stack>
        </Steps.Content>
      ))}
    </Steps.Root>
  );
}
