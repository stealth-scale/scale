import { type ReactElement } from "react";

import { CheckIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Steps from "#steps/index.ts";

const STAGES = ["ordered", "packed", "shipped", "delivered"] as const;

export function Parcel(): ReactElement {
  const { t } = useWords("steps");

  return (
    <Steps.Root count={STAGES.length} labelPlacement="below" size="sm" step={2}>
      <Steps.List>
        {STAGES.map((stage, index) => (
          <Steps.Item index={index} key={stage}>
            <Steps.Indicator>
              <Steps.Status complete={<CheckIcon />} />
            </Steps.Indicator>
            <Steps.Title>{t(`parcel.${stage}.title`)}</Steps.Title>
            <Steps.Description>{t(`parcel.${stage}.date`)}</Steps.Description>
            <Steps.Separator />
          </Steps.Item>
        ))}
      </Steps.List>
    </Steps.Root>
  );
}
