import { type ReactElement } from "react";

import {
  ArchiveIcon,
  CheckIcon,
  ForwardIcon,
  InboxIcon,
  MenuIcon,
  ReplyIcon,
  SendIcon,
  ShieldAlertIcon,
  StarIcon,
} from "lucide-react";

import { Listbox, useListCollection } from "@stealthscale/component-collections";
import { Stack } from "@stealthscale/component-layout";
import { Avatar } from "@stealthscale/component-media";
import { NavList } from "@stealthscale/component-navigation";
import { Heading, Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as AppShell from "#app-shell/index.ts";
import * as Sidebar from "#sidebar/index.ts";
import * as Toolbar from "#toolbar/index.ts";

interface Message {
  readonly from: string;
  readonly id: string;
  readonly subject: string;
}

const FOLDERS = [
  ["inbox", InboxIcon, "page", "12"],
  ["starred", StarIcon, undefined, undefined],
  ["sent", SendIcon, undefined, undefined],
  ["archive", ArchiveIcon, undefined, undefined],
  ["spam", ShieldAlertIcon, undefined, "3"],
] as const;

const MAIL = ["invoiceOverdue", "offsite", "buildFailed", "lunch"] as const;

const ACTIONS = [
  ["reply", ReplyIcon],
  ["forward", ForwardIcon],
  ["archive", ArchiveIcon],
] as const;

export function Mail(props: AppShell.RootProps): ReactElement {
  const { t } = useWords("app-shell");
  const { collection } = useListCollection<Message>({
    itemToString: (message) => message.subject,
    itemToValue: (message) => message.id,
    rows: MAIL.map((id) => ({ from: t(`${id}From`), id, subject: t(id) })),
  });

  return (
    <AppShell.Root {...props}>
      <AppShell.Header>
        <Toolbar.Root aria-label={t("post")} size="sm">
          <Toolbar.Start>
            <Toolbar.Item
              aria-label={t("folders")}
              as={AppShell.Trigger}
              panel="folders"
              shape="square"
            >
              <MenuIcon />
            </Toolbar.Item>
            <Text as="span" size="sm" weight="semibold">
              {t("post")}
            </Text>
          </Toolbar.Start>
          <Toolbar.End>
            <Toolbar.Action primary>{t("compose")}</Toolbar.Action>
          </Toolbar.End>
        </Toolbar.Root>
      </AppShell.Header>
      <AppShell.Body>
        <AppShell.Navbar collapse="icons" foldsBelow="sm" name="folders" width="11rem">
          <Sidebar.Root variant="subtle">
            <Sidebar.Content>
              <Sidebar.Nav aria-label={t("folders")}>
                <NavList.Root>
                  {FOLDERS.map(([folder, Glyph, current, count]) => (
                    <NavList.Item key={folder}>
                      <NavList.Link aria-current={current} href={`#${folder}`} tooltip={t(folder)}>
                        <Glyph />
                        <span>{t(folder)}</span>
                      </NavList.Link>
                      {count === undefined ? null : <NavList.Badge>{count}</NavList.Badge>}
                    </NavList.Item>
                  ))}
                </NavList.Root>
              </Sidebar.Nav>
            </Sidebar.Content>
          </Sidebar.Root>
        </AppShell.Navbar>
        <AppShell.Rail panel="folders" />
        <AppShell.Navbar foldsBelow="sm" name="list" width="16rem">
          <AppShell.Section grows scrolls>
            <Listbox.Simple<Message>
              collection={collection}
              defaultValue={["invoiceOverdue"]}
              description={(message) => message.from}
              label={t("inbox")}
              mark={<CheckIcon size="100%" />}
              size="sm"
            />
          </AppShell.Section>
        </AppShell.Navbar>
        <AppShell.Main>
          <AppShell.Section>
            <Toolbar.Root aria-label={t("messageActions")} size="sm">
              <Toolbar.Start>
                {ACTIONS.map(([action, Glyph]) => (
                  <Toolbar.Action icon={<Glyph />} key={action}>
                    {t(action)}
                  </Toolbar.Action>
                ))}
              </Toolbar.Start>
            </Toolbar.Root>
            <Heading as="h2" size="sm">
              {t("invoiceOverdue")}
            </Heading>
            <Stack direction="row" gap="sm">
              <Avatar.Root aria-hidden name={t("accounts")} palette="accent" size="sm">
                <Avatar.Fallback />
              </Avatar.Root>
              <Stack gap="xs">
                <Text size="sm" weight="semibold">
                  {t("accounts")}
                </Text>
                <Text size="xs" tone="muted">
                  {t("accountsWhen")}
                </Text>
              </Stack>
            </Stack>
            <Text size="sm">{t("invoiceBody")}</Text>
            <Text size="sm">{t("invoiceThanks")}</Text>
          </AppShell.Section>
        </AppShell.Main>
      </AppShell.Body>
    </AppShell.Root>
  );
}
