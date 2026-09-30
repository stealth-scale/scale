import { type ReactElement, useState } from "react";

import { CheckIcon, CircleAlertIcon } from "lucide-react";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { Checkbox, Field } from "@stealthscale/component-forms";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Steps from "#steps/index.ts";

const STEPS = ["account", "amount", "confirm"] as const;

export function Gated(): ReactElement {
  const { t } = useWords("steps");
  const [agreed, setAgreed] = useState(false);
  const [refused, setRefused] = useState(false);

  return (
    <Steps.Root
      count={STEPS.length}
      isStepValid={(index) => index !== 1 || agreed}
      linear
      onStepInvalid={() => {
        setRefused(true);
      }}
    >
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
      <Steps.Content index={0}>{t("payout.account.body")}</Steps.Content>
      <Steps.Content index={1}>
        <Field.Root invalid={refused && !agreed}>
          <Checkbox.Root
            checked={agreed}
            onCheckedChange={({ checked }) => {
              setAgreed(checked === true);
            }}
          >
            <Checkbox.Control>
              <Checkbox.Indicator>
                <CheckIcon strokeWidth={3} />
              </Checkbox.Indicator>
            </Checkbox.Control>
            <Checkbox.Label>{t("gated.agree")}</Checkbox.Label>
          </Checkbox.Root>
          <Field.ErrorText>
            <CircleAlertIcon />
            {t("gated.check")}
          </Field.ErrorText>
        </Field.Root>
      </Steps.Content>
      <Steps.Content index={2}>{t("payout.confirm.body")}</Steps.Content>
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
