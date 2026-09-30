import { type ReactElement } from "react";

import { CheckIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as CheckboxCard from "#checkbox-card/index.ts";
import * as Fieldset from "#fieldset/index.ts";

const CHANNELS = ["email", "sms", "push"] as const;

export function Notifications(props: CheckboxCard.RootProps): ReactElement {
  const { t } = useWords("checkbox-card");

  return (
    <Fieldset.Root orientation="horizontal">
      <Fieldset.Legend>{t("notify")}</Fieldset.Legend>
      {CHANNELS.map((channel) => (
        <CheckboxCard.Root
          defaultChecked={channel === "email"}
          key={channel}
          value={channel}
          {...props}
        >
          <CheckboxCard.Content>
            <CheckboxCard.Label>{t(`channels.${channel}.title`)}</CheckboxCard.Label>
            <CheckboxCard.Description>{t(`channels.${channel}.about`)}</CheckboxCard.Description>
            <CheckboxCard.Control>
              <CheckboxCard.Indicator>
                <CheckIcon strokeWidth={3} />
              </CheckboxCard.Indicator>
            </CheckboxCard.Control>
          </CheckboxCard.Content>
        </CheckboxCard.Root>
      ))}
    </Fieldset.Root>
  );
}
