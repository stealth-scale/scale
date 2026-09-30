import { type ReactElement, useState } from "react";

import { Button } from "@stealthscale/component-actions";
import { Switch } from "@stealthscale/component-forms";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Page from "#page/index.ts";

const EVENTS = [
  "deployed",
  "failed",
  "invited",
  "joined",
  "renewed",
  "billed",
  "limited",
  "expired",
];

const CHANNELS = [
  { count: 8, value: "email" },
  { count: 3, value: "push" },
  { count: 2, value: "digest" },
] as const;

export function Notifications(): ReactElement {
  const { t } = useWords("page");
  const [channel, setChannel] = useState("email");
  const shown = CHANNELS.find(({ value }) => value === channel)?.count ?? 0;

  return (
    <Page.Root size="sm">
      <Page.Header sticky>
        <Page.Title as="h3">{t("notifications.title")}</Page.Title>
        <Page.Description>{t("notifications.about")}</Page.Description>
        <Page.Actions>
          <Page.Action>{t("notifications.reset")}</Page.Action>
        </Page.Actions>
      </Page.Header>
      <Page.Nav aria-label={t("notifications.channels")} sticky>
        <Page.TabList
          aria-label={t("notifications.channels")}
          onValueChange={setChannel}
          value={channel}
        >
          {CHANNELS.map(({ value }) => (
            <Page.Tab key={value} value={value}>
              {t(`notifications.${value}`)}
            </Page.Tab>
          ))}
        </Page.TabList>
      </Page.Nav>
      <Page.Body>
        <Stack gap="md">
          {EVENTS.slice(0, shown).map((event, at) => (
            <Switch.Root defaultChecked={at % 3 !== 2} key={event} size="sm" spread>
              <Switch.Label>{t(`notifications.events.${event}`)}</Switch.Label>
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
            </Switch.Root>
          ))}
        </Stack>
      </Page.Body>
      <Page.Footer sticky>
        <Button size="sm">{t("notifications.save")}</Button>
        <Button size="sm" variant="ghost">
          {t("notifications.cancel")}
        </Button>
      </Page.Footer>
    </Page.Root>
  );
}
