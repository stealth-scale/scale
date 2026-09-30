import { type ReactElement, useId } from "react";

import {
  GitBranchIcon,
  LayersIcon,
  MenuIcon,
  PanelRightIcon,
  PlayIcon,
  SearchIcon,
  SettingsIcon,
  ShieldCheckIcon,
} from "lucide-react";

import { DataList, Table } from "@stealthscale/component-collections";
import { Status } from "@stealthscale/component-data";
import { NavList } from "@stealthscale/component-navigation";
import { Code, Heading, Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as AppShell from "#app-shell/index.ts";
import * as Sidebar from "#sidebar/index.ts";
import * as Toolbar from "#toolbar/index.ts";

const PAGES = [
  ["runs", PlayIcon, "page", "12"],
  ["pipelines", GitBranchIcon, undefined, undefined],
  ["approvals", ShieldCheckIcon, undefined, "3"],
  ["environments", LayersIcon, undefined, undefined],
  ["settings", SettingsIcon, undefined, undefined],
] as const;

const RUNS = [
  ["4128", "main", "success", "passed", "4m 12s"],
  ["4127", "main", "success", "passed", "4m 34s"],
  ["4126", "fix/retry", "error", "failed", "1m 08s"],
] as const;

const FACTS = [
  ["started", "clock"],
  ["duration", "took"],
  ["trigger", "push"],
] as const;

export function Console(props: AppShell.RootProps): ReactElement {
  const { t } = useWords("app-shell");
  const runs = useId();

  return (
    <AppShell.Root {...props}>
      <AppShell.Header>
        <Toolbar.Root aria-label={t("ledger")} size="sm">
          <Toolbar.Start>
            <Toolbar.Item aria-label={t("navigation")} as={AppShell.Trigger} shape="square">
              <MenuIcon />
            </Toolbar.Item>
            <Text as="span" size="sm" weight="semibold">
              {t("ledger")}
            </Text>
          </Toolbar.Start>
          <Toolbar.End>
            <Toolbar.Action primary>{t("newRun")}</Toolbar.Action>
            <Toolbar.Item
              aria-label={t("details")}
              as={AppShell.Trigger}
              panel="aside"
              shape="square"
            >
              <PanelRightIcon />
            </Toolbar.Item>
          </Toolbar.End>
        </Toolbar.Root>
      </AppShell.Header>
      <AppShell.Body>
        <AppShell.Navbar collapse="icons" foldsBelow="sm" shortcut="b">
          <Sidebar.Root variant="subtle">
            <Sidebar.Header>
              <Sidebar.Search
                aria-label={t("findPage")}
                placeholder={t("filter")}
                searchIndicator={<SearchIcon />}
              />
            </Sidebar.Header>
            <Sidebar.Content>
              <Sidebar.Nav>
                <Sidebar.NavLabel>{t("platform")}</Sidebar.NavLabel>
                <NavList.Root>
                  {PAGES.map(([page, Glyph, current, count]) => (
                    <NavList.Item key={page}>
                      <NavList.Link aria-current={current} href={`#${page}`} tooltip={t(page)}>
                        <Glyph />
                        <span>{t(page)}</span>
                      </NavList.Link>
                      {count === undefined ? null : <NavList.Badge>{count}</NavList.Badge>}
                    </NavList.Item>
                  ))}
                </NavList.Root>
              </Sidebar.Nav>
            </Sidebar.Content>
            <Sidebar.Footer>
              <Text size="sm" tone="muted">
                {t("version")}
              </Text>
            </Sidebar.Footer>
          </Sidebar.Root>
        </AppShell.Navbar>
        <AppShell.Rail />
        <AppShell.Main>
          <AppShell.Section>
            <Heading as="h2" id={runs} size="sm">
              {t("runs")}
            </Heading>
            <Table.Scroller aria-labelledby={runs} size="sm" variant="surface">
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    {["run", "branch", "status", "duration"].map((column) => (
                      <Table.ColumnHeader key={column}>{t(column)}</Table.ColumnHeader>
                    ))}
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {RUNS.map(([run, branch, palette, state, took]) => (
                    <Table.Row key={run}>
                      <Table.RowHeader>#{run}</Table.RowHeader>
                      <Table.Cell>
                        <Code size="sm">{branch}</Code>
                      </Table.Cell>
                      <Table.Cell>
                        <Status.Root palette={palette} size="inherit">
                          <Status.Indicator />
                          {t(state)}
                        </Status.Root>
                      </Table.Cell>
                      <Table.Cell>{took}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Table.Scroller>
          </AppShell.Section>
        </AppShell.Main>
        <AppShell.Aside width="18rem">
          <AppShell.Section>
            <Heading as="h2" size="xs">
              {t("run4128")}
            </Heading>
            <DataList.Root orientation="horizontal" size="sm">
              <DataList.Item>
                <DataList.ItemLabel>{t("status")}</DataList.ItemLabel>
                <DataList.ItemValue>
                  <Status.Root palette="success" size="inherit">
                    <Status.Indicator />
                    {t("passed")}
                  </Status.Root>
                </DataList.ItemValue>
              </DataList.Item>
              {FACTS.map(([label, value]) => (
                <DataList.Item key={label}>
                  <DataList.ItemLabel>{t(label)}</DataList.ItemLabel>
                  <DataList.ItemValue>{t(value)}</DataList.ItemValue>
                </DataList.Item>
              ))}
            </DataList.Root>
          </AppShell.Section>
        </AppShell.Aside>
      </AppShell.Body>
      <AppShell.Footer>
        <Status.Root palette="success" size="sm">
          <Status.Indicator />
          {t("connected")}
        </Status.Root>
      </AppShell.Footer>
    </AppShell.Root>
  );
}
