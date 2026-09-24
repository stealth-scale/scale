import { type ReactElement, useState } from "react";

import { CheckIcon, MinusIcon } from "lucide-react";

import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Checkbox from "#checkbox/index.ts";

const CHANNELS = ["email", "sms", "push"] as const;

type Channel = (typeof CHANNELS)[number];

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

export function Notifications(): ReactElement {
  const { t } = useWords("checkbox");
  const [chosen, setChosen] = useState<readonly Channel[]>(["email"]);
  const all = chosen.length === CHANNELS.length || (chosen.length > 0 && "indeterminate");

  return (
    <Stack gap="sm">
      <Checkbox.Root
        checked={all}
        onCheckedChange={({ checked }) => {
          setChosen(checked === true ? CHANNELS : []);
        }}
      >
        {MARKS}
        <Checkbox.Label>{t("all")}</Checkbox.Label>
      </Checkbox.Root>
      {CHANNELS.map((channel) => (
        <Checkbox.Root
          checked={chosen.includes(channel)}
          key={channel}
          onCheckedChange={({ checked }) => {
            setChosen(
              checked === true
                ? CHANNELS.filter((each) => each === channel || chosen.includes(each))
                : chosen.filter((each) => each !== channel),
            );
          }}
        >
          {MARKS}
          <Checkbox.Label>{t(`channels.${channel}`)}</Checkbox.Label>
        </Checkbox.Root>
      ))}
    </Stack>
  );
}
