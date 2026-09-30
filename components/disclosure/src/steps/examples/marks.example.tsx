import { type ReactElement } from "react";

import { BanknoteIcon, CheckIcon, PenLineIcon, WalletIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Steps from "#steps/index.ts";

const STEPS = [
  { Icon: WalletIcon, step: "account" },
  { Icon: BanknoteIcon, step: "amount" },
  { Icon: PenLineIcon, step: "confirm" },
] as const;

export function Marks(): ReactElement {
  const { t } = useWords("steps");

  return (
    <Steps.Root count={STEPS.length} defaultStep={1}>
      <Steps.List>
        {STEPS.map(({ Icon, step }, index) => (
          <Steps.Item index={index} key={step}>
            <Steps.Trigger>
              <Steps.Indicator>
                <Steps.Status complete={<CheckIcon />} current={<Icon />} incomplete={<Icon />} />
              </Steps.Indicator>
              <Steps.Title>{t(`payout.${step}.title`)}</Steps.Title>
            </Steps.Trigger>
            <Steps.Separator />
          </Steps.Item>
        ))}
      </Steps.List>
      {STEPS.map(({ step }, index) => (
        <Steps.Content index={index} key={step}>
          {t(`payout.${step}.body`)}
        </Steps.Content>
      ))}
    </Steps.Root>
  );
}
