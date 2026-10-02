import { type ReactElement } from "react";

import { CheckIcon, MinusIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Checkbox from "#checkbox/index.ts";
import * as Fieldset from "#fieldset/index.ts";

const CHANNELS = ["email", "sms", "push"];

const CHOSEN = ["email"];

const MARKS = (
  <Checkbox.Control>
    <Checkbox.Indicator>
      <CheckIcon strokeWidth={3} />
    </Checkbox.Indicator>
    <Checkbox.Indicator indeterminate>
      <MinusIcon strokeWidth={3} />
    </Checkbox.Indicator>
  </Checkbox.Control>
);

export function Notifications(props: Checkbox.GroupProps): ReactElement {
  const { t } = useWords("checkbox");

  return (
    <Fieldset.Root>
      <Fieldset.Legend>{t("reminders")}</Fieldset.Legend>
      <Checkbox.Group allValues={CHANNELS} defaultValue={CHOSEN} name="channels" {...props}>
        <Checkbox.Root parent>
          {MARKS}
          <Checkbox.Label>{t("all")}</Checkbox.Label>
        </Checkbox.Root>
        {CHANNELS.map((channel) => (
          <Checkbox.Root key={channel} value={channel}>
            {MARKS}
            <Checkbox.Label>{t(`channels.${channel}`)}</Checkbox.Label>
          </Checkbox.Root>
        ))}
      </Checkbox.Group>
    </Fieldset.Root>
  );
}
