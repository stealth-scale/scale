import { type ReactElement } from "react";

import { ArchiveIcon, DownloadIcon, EllipsisIcon, FileTextIcon } from "lucide-react";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { Menu } from "@stealthscale/component-disclosure";
import { Portal } from "@stealthscale/component-primitives";
import { Icon, Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Page from "#page/index.ts";

export function Invoice(props: Page.RootProps): ReactElement {
  const { t } = useWords("page");

  return (
    <Page.Root {...props}>
      <Page.Header>
        <Page.Trail href="#invoices">{t("invoices")}</Page.Trail>
        <Page.Leading>
          <Icon size="lg" tone="muted">
            <FileTextIcon />
          </Icon>
        </Page.Leading>
        <Page.Title as="h3">{t("april")}</Page.Title>
        <Page.Meta>
          <Text size="sm" tone="muted">
            {t("raised")}
          </Text>
        </Page.Meta>
        <Page.Description>{t("everything")}</Page.Description>
        <Page.Actions>
          <ButtonPropsProvider value={{ variant: "subtle" }}>
            <Page.Action as={Button} priority="tertiary">
              <ArchiveIcon size="1em" />
              <span>{t("archive")}</span>
            </Page.Action>
            <Page.Action as={Button} priority="secondary">
              <DownloadIcon size="1em" />
              <span>{t("download")}</span>
            </Page.Action>
          </ButtonPropsProvider>
          <Page.Action as={Button}>{t("send")}</Page.Action>
          <Menu.Root>
            <Menu.Trigger aria-label={t("more")} as={Page.Folded}>
              <EllipsisIcon size="1em" />
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item value="archive">{t("archive")}</Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </Page.Actions>
      </Page.Header>
      <Page.Body>
        <Text>{t("lines")}</Text>
      </Page.Body>
    </Page.Root>
  );
}
