import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Fieldset from "#fieldset/index.ts";
import * as Switch from "#switch/index.ts";

const CHANNELS = ["email", "sms", "push"] as const;

export function Channels(): ReactElement {
  const { t } = useWords("switch");

  return (
    <Fieldset.Root size="sm">
      <Fieldset.Legend>{t("notifications")}</Fieldset.Legend>
      {CHANNELS.map((channel) => (
        <Switch.Root defaultChecked={channel === "email"} key={channel} name={channel} spread>
          <Switch.Label>{t(`channels.${channel}`)}</Switch.Label>
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
        </Switch.Root>
      ))}
      <Fieldset.HelperText>{t("quiet")}</Fieldset.HelperText>
    </Fieldset.Root>
  );
}
