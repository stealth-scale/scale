import { type ReactElement } from "react";

import {
  CheckIcon,
  ChevronsUpDownIcon,
  GitBranchIcon,
  HouseIcon,
  MenuIcon,
  PlayIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { NavList } from "@stealthscale/component-navigation";
import { useWords } from "@stealthscale/specimen";

import * as AppShell from "#app-shell/index.ts";
import * as Sidebar from "#sidebar/index.ts";
import * as Switcher from "#switcher/index.ts";

const GHOST = { shape: "square", size: "sm", variant: "ghost" } as const;

const WORKSPACES = [
  ["ledger", "production"],
  ["northwind", "trial"],
  ["acme", "enterprise"],
] as const;

const PAGES = [
  ["overview", HouseIcon, undefined],
  ["runs", PlayIcon, "page"],
  ["pipelines", GitBranchIcon, undefined],
] as const;

export function Console(props: AppShell.RootProps): ReactElement {
  const { t } = useWords("switcher");

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
              <Switcher.Root
                checkIcon={<CheckIcon size="1em" />}
                indicator={<ChevronsUpDownIcon size="1em" />}
                items={WORKSPACES.map(([name, plan]) => ({
                  detail: t(plan),
                  label: t(name),
                  value: name,
                }))}
                label={t("workspace")}
              >
                <Switcher.Action icon={<PlusIcon size="1em" />}>{t("new")}</Switcher.Action>
              </Switcher.Root>
              <Sidebar.Search
                aria-label={t("findPage")}
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
          </Sidebar.Root>
        </AppShell.Navbar>
        <AppShell.Main />
      </AppShell.Body>
    </AppShell.Root>
  );
}
