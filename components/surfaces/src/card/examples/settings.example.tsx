import { type ReactElement } from "react";

import { Switch } from "@stealthscale/component-forms";
import { useWords } from "@stealthscale/specimen";

import * as Card from "#card/index.ts";

export function Settings(): ReactElement {
  const { t } = useWords("card");
  const alerts = [
    { checked: true, name: "payouts" },
    { checked: true, name: "overdue" },
    { checked: false, name: "digest" },
  ];

  return (
    <Card.Root aria-label={t("settings.title")}>
      <Card.Header>
        <Card.Title>{t("settings.title")}</Card.Title>
        <Card.Description>{t("settings.about")}</Card.Description>
      </Card.Header>
      {alerts.map((alert) => (
        <Card.Section key={alert.name}>
          <Switch.Root defaultChecked={alert.checked} spread>
            <Switch.Label>{t(`settings.${alert.name}`)}</Switch.Label>
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
          </Switch.Root>
        </Card.Section>
      ))}
    </Card.Root>
  );
}
