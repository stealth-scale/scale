import { type ReactElement } from "react";

import { DownloadIcon, EllipsisIcon, MailIcon } from "lucide-react";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { Menu } from "@stealthscale/component-disclosure";
import { Portal } from "@stealthscale/component-primitives";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Section from "#section/index.ts";

export function Billing(props: Section.RootProps): ReactElement {
  const { t } = useWords("section");

  return (
    <Section.Root variant="surface" {...props}>
      <Section.Header>
        <Section.Title as="h3">{t("billing")}</Section.Title>
        <Section.Description>{t("plan")}</Section.Description>
        <Section.Actions>
          <ButtonPropsProvider value={{ variant: "subtle" }}>
            <Section.Action as={Button} priority="tertiary">
              <MailIcon size="1em" />
              <span>{t("contact")}</span>
            </Section.Action>
            <Section.Action as={Button} priority="secondary">
              <DownloadIcon size="1em" />
              <span>{t("download")}</span>
            </Section.Action>
          </ButtonPropsProvider>
          <Section.Action as={Button}>{t("changePlan")}</Section.Action>
          <Menu.Root>
            <Menu.Trigger aria-label={t("more")} as={Section.Folded}>
              <EllipsisIcon size="1em" />
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item value="contact">{t("contact")}</Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </Section.Actions>
      </Section.Header>
      <Section.Body>
        <Text>{t("usage")}</Text>
      </Section.Body>
      <Section.Footer>
        <Text size="sm" tone="muted">
          {t("next")}
        </Text>
        <Button variant="ghost">{t("cancel")}</Button>
      </Section.Footer>
    </Section.Root>
  );
}
