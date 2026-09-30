import { type ReactElement } from "react";

import {
  AtSignIcon,
  BotIcon,
  Building2Icon,
  FlaskConicalIcon,
  HashIcon,
  type LucideIcon,
  MenuIcon,
  SearchIcon,
  SendHorizontalIcon,
  WrenchIcon,
} from "lucide-react";

import { IconButton } from "@stealthscale/component-actions";
import { InputGroup } from "@stealthscale/component-forms";
import { Stack } from "@stealthscale/component-layout";
import { Avatar } from "@stealthscale/component-media";
import { NavList } from "@stealthscale/component-navigation";
import { Span, Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as AppShell from "#app-shell/index.ts";
import * as Sidebar from "#sidebar/index.ts";
import * as Toolbar from "#toolbar/index.ts";

type Room = readonly [name: string, current?: "page" | undefined, unread?: string | undefined];

const WORKSPACES = [
  ["stealth", Building2Icon, "page"],
  ["operations", WrenchIcon, undefined],
  ["quality", FlaskConicalIcon, undefined],
] as const;

const ROOMS: ReadonlyArray<readonly [string, LucideIcon, readonly Room[]]> = [
  ["channels", HashIcon, [["general"], ["deploys", "page"], ["incidents", undefined, "2"]]],
  ["direct", AtSignIcon, [["mara"], ["jonas", undefined, "1"]]],
];

const MESSAGES = [
  ["09:02", "jonas", "tagged"],
  ["09:05", "mara", "starting"],
  ["09:08", "bot", "live"],
  ["09:12", "mara", "rolling"],
  ["09:14", "jonas", "canary"],
  ["09:15", "mara", "fleet"],
  ["09:17", "bot", "hosts"],
  ["09:19", "bot", "deployed"],
  ["09:20", "jonas", "closing"],
  ["09:21", "mara", "thanks"],
] as const;

const AUTHORS = {
  bot: { palette: "primary", shape: "rounded", variant: "solid" },
  jonas: { palette: "accent" },
  mara: { palette: "secondary" },
} as const;

export function Chat(props: AppShell.RootProps): ReactElement {
  const { t } = useWords("app-shell");

  return (
    <AppShell.Root {...props}>
      <AppShell.Header>
        <Toolbar.Root aria-label={t("relay")} size="sm">
          <Toolbar.Start>
            <Toolbar.Item
              aria-label={t("channels")}
              as={AppShell.Trigger}
              panel="channels"
              shape="square"
            >
              <MenuIcon />
            </Toolbar.Item>
            <Text as="span" size="sm" weight="semibold">
              {t("relay")}
            </Text>
          </Toolbar.Start>
        </Toolbar.Root>
      </AppShell.Header>
      <AppShell.Body>
        <AppShell.Navbar foldsBelow="never" name="rail" width="3.5rem">
          <Sidebar.Root iconic>
            <Sidebar.Content>
              <Sidebar.Nav aria-label={t("workspaces")}>
                <NavList.Root>
                  {WORKSPACES.map(([workspace, Glyph, current]) => (
                    <NavList.Item key={workspace}>
                      <NavList.Link
                        aria-current={current}
                        href={`#${workspace}`}
                        tooltip={t(workspace)}
                      >
                        <Glyph />
                        <span>{t(workspace)}</span>
                      </NavList.Link>
                    </NavList.Item>
                  ))}
                </NavList.Root>
              </Sidebar.Nav>
            </Sidebar.Content>
          </Sidebar.Root>
        </AppShell.Navbar>
        <AppShell.Navbar name="channels" width="14rem">
          <Sidebar.Root variant="subtle">
            <Sidebar.Header>
              <Sidebar.Search
                aria-label={t("jumpTo")}
                placeholder={t("jumpTo")}
                searchIndicator={<SearchIcon />}
              />
            </Sidebar.Header>
            <Sidebar.Content>
              {ROOMS.map(([group, Glyph, rooms]) => (
                <Sidebar.Nav key={group}>
                  <Sidebar.NavLabel>{t(group)}</Sidebar.NavLabel>
                  <NavList.Root>
                    {rooms.map(([room, current, unread]) => (
                      <NavList.Item key={room}>
                        <NavList.Link aria-current={current} href={`#${room}`}>
                          <Glyph />
                          <span>{t(room)}</span>
                        </NavList.Link>
                        {unread === undefined ? null : <NavList.Badge>{unread}</NavList.Badge>}
                      </NavList.Item>
                    ))}
                  </NavList.Root>
                </Sidebar.Nav>
              ))}
              <Sidebar.Empty>{t("noRoom")}</Sidebar.Empty>
            </Sidebar.Content>
          </Sidebar.Root>
        </AppShell.Navbar>
        <AppShell.Main>
          <AppShell.Section>
            <Stack gap="md">
              {MESSAGES.map(([time, who, said]) => (
                <Stack align="flex-start" direction="row" gap="sm" key={said}>
                  <Avatar.Root aria-hidden name={t(who)} size="xs" {...AUTHORS[who]}>
                    <Avatar.Fallback>{who === "bot" ? <BotIcon /> : null}</Avatar.Fallback>
                  </Avatar.Root>
                  <Stack gap="xs">
                    <Text size="sm">
                      <Span weight="semibold">{t(who)}</Span> <Span tone="muted">{time}</Span>
                    </Text>
                    <Text size="sm">{t(said)}</Text>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </AppShell.Section>
          <AppShell.Footer sticky>
            <InputGroup.Root size="sm">
              <InputGroup.Field aria-label={t("message")} placeholder={t("messageDeploys")} />
              <InputGroup.Mark>
                <IconButton aria-label={t("send")} size="xs" variant="ghost">
                  <SendHorizontalIcon />
                </IconButton>
              </InputGroup.Mark>
            </InputGroup.Root>
          </AppShell.Footer>
        </AppShell.Main>
      </AppShell.Body>
    </AppShell.Root>
  );
}
