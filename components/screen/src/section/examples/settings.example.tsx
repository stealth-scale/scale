import { type ReactElement } from "react";

import { KeyRoundIcon, PencilIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Switch } from "@stealthscale/component-forms";
import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Page from "#page/index.ts";
import * as Section from "#section/index.ts";

const FACTS = ["name", "region", "plan"] as const;

const CHANNELS = ["deploys", "failures", "digest"] as const;

export function Settings(): ReactElement {
  const { t } = useWords("section");

  return (
    <Page.Root>
      <Page.Header>
        <Page.Title as="h3">{t("workspace.title")}</Page.Title>
        <Page.Description>{t("workspace.about")}</Page.Description>
      </Page.Header>
      <Page.Body>
        <Section.Root>
          <Section.Header>
            <Section.Title as="h4">{t("profile.title")}</Section.Title>
            <Section.Description>{t("profile.about")}</Section.Description>
            <Section.Actions>
              <Section.Action icon={<PencilIcon size="1em" />}>{t("edit")}</Section.Action>
            </Section.Actions>
          </Section.Header>
          <Section.Body>
            <Stack direction="row" gap="2xl" wrap>
              {FACTS.map((fact) => (
                <Stack gap="xs" key={fact}>
                  <Text size="sm" tone="muted">
                    {t(`facts.${fact}.label`)}
                  </Text>
                  <Text size="sm">{t(`facts.${fact}.value`)}</Text>
                </Stack>
              ))}
            </Stack>
          </Section.Body>
        </Section.Root>
        <Section.Root>
          <Section.Header>
            <Section.Title as="h4">{t("notifications.title")}</Section.Title>
            <Section.Description>{t("notifications.about")}</Section.Description>
          </Section.Header>
          <Section.Body>
            <Stack gap="md">
              {CHANNELS.map((channel) => (
                <Switch.Root defaultChecked={channel !== "digest"} key={channel} size="sm">
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                  <Switch.Label>
                    <Stack as="span" gap="xs">
                      <Text as="span" size="sm">
                        {t(`channels.${channel}.name`)}
                      </Text>
                      <Text as="span" size="sm" tone="muted">
                        {t(`channels.${channel}.about`)}
                      </Text>
                    </Stack>
                  </Switch.Label>
                </Switch.Root>
              ))}
            </Stack>
          </Section.Body>
        </Section.Root>
        <Section.Root>
          <Section.Header>
            <Section.Title as="h4">{t("keys.title")}</Section.Title>
            <Section.Description>{t("keys.about")}</Section.Description>
            <Section.Actions>
              <Section.Action icon={<KeyRoundIcon size="1em" />}>{t("keys.add")}</Section.Action>
            </Section.Actions>
          </Section.Header>
          <Section.Body>
            <Text size="sm" tone="muted">
              {t("keys.none")}
            </Text>
          </Section.Body>
        </Section.Root>
        <Section.Root variant="surface">
          <Section.Header>
            <Section.Title as="h4">{t("danger.title")}</Section.Title>
            <Section.Description>{t("danger.about")}</Section.Description>
          </Section.Header>
          <Section.Footer>
            <Text size="sm" tone="muted">
              {t("danger.owner")}
            </Text>
            <Button palette="error" size="sm" variant="outline">
              {t("danger.delete")}
            </Button>
          </Section.Footer>
        </Section.Root>
      </Page.Body>
    </Page.Root>
  );
}
