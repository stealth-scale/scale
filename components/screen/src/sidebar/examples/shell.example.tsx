import { type ReactElement } from "react";

import {
  GitBranchIcon,
  HouseIcon,
  MenuIcon,
  PlayIcon,
  SearchIcon,
  ShieldCheckIcon,
  UserIcon,
  XIcon,
} from "lucide-react";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { NavList } from "@stealthscale/component-navigation";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as AppShell from "#app-shell/index.ts";
import * as Page from "#page/index.ts";
import * as Sidebar from "#sidebar/index.ts";

const GHOST = { shape: "square", size: "sm", variant: "ghost" } as const;

const PAGES = [
  ["overview", HouseIcon, undefined],
  ["runs", PlayIcon, "page"],
  ["pipelines", GitBranchIcon, undefined],
  ["approvals", ShieldCheckIcon, undefined],
] as const;

export function Shell(props: AppShell.RootProps): ReactElement {
  const { t } = useWords("sidebar");

  return (
    <AppShell.Root {...props}>
      <AppShell.Header>
        <ButtonPropsProvider value={GHOST}>
          <AppShell.Trigger aria-label={t("navigation")} as={Button}>
            <MenuIcon />
          </AppShell.Trigger>
        </ButtonPropsProvider>
      </AppShell.Header>
      <AppShell.Body>
        <AppShell.Navbar collapse="icons" foldsBelow="sm">
          <Sidebar.Root variant="subtle">
            <Sidebar.Header>
              <Text as="p" size="sm" truncate weight="medium">
                {t("ledger")}
              </Text>
              <Sidebar.Search
                aria-label={t("findPage")}
                clearIndicator={<XIcon />}
                clearLabel={t("clearFilter")}
                placeholder={t("filter")}
                searchIndicator={<SearchIcon />}
              />
            </Sidebar.Header>
            <Sidebar.Content>
              <Sidebar.Nav>
                <Sidebar.NavLabel as="h3">{t("platform")}</Sidebar.NavLabel>
                <NavList.Root>
                  {PAGES.map(([page, Glyph, current]) => (
                    <NavList.Item key={page}>
                      <NavList.Link aria-current={current} href={`#${page}`} tooltip={t(page)}>
                        <Glyph />
                        <span>{t(page)}</span>
                      </NavList.Link>
                    </NavList.Item>
                  ))}
                </NavList.Root>
              </Sidebar.Nav>
            </Sidebar.Content>
            <Sidebar.Footer>
              <Sidebar.Nav aria-label={t("account")}>
                <NavList.Root>
                  <NavList.Item>
                    <NavList.Link href="#account" tooltip={t("person")}>
                      <UserIcon />
                      <span>{t("person")}</span>
                    </NavList.Link>
                  </NavList.Item>
                </NavList.Root>
              </Sidebar.Nav>
            </Sidebar.Footer>
          </Sidebar.Root>
        </AppShell.Navbar>
        <AppShell.Main>
          <Page.Root size="sm">
            <Page.Header>
              <Page.Title as="h3">{t("runs")}</Page.Title>
              <Page.Description>{t("runsAbout")}</Page.Description>
            </Page.Header>
          </Page.Root>
        </AppShell.Main>
      </AppShell.Body>
    </AppShell.Root>
  );
}
