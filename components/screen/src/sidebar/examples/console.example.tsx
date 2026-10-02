import { Fragment, type ReactElement } from "react";

import {
  FolderIcon,
  GitBranchIcon,
  HouseIcon,
  PlayIcon,
  PlusIcon,
  SearchIcon,
  ShieldCheckIcon,
  UserIcon,
  XIcon,
} from "lucide-react";

import { NavList } from "@stealthscale/component-navigation";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Sidebar from "#sidebar/index.ts";

const BLOCKS = [
  {
    label: "platform",
    rows: [
      ["overview", HouseIcon],
      ["runs", PlayIcon],
      ["pipelines", GitBranchIcon],
      ["approvals", ShieldCheckIcon],
    ],
  },
  {
    label: "projects",
    rows: ["billing", "checkout", "onboarding", "catalog", "warehouse"].map(
      (project) => [project, FolderIcon] as const,
    ),
  },
] as const;

export function Console(props: Sidebar.RootProps): ReactElement {
  const { t } = useWords("sidebar");

  return (
    <Sidebar.Root {...props}>
      <Sidebar.Header>
        <Text as="p" size="sm" truncate weight="medium">
          {t("ledger")}{" "}
          <Text as="span" size="sm" tone="subtle" weight="normal">
            {t("production")}
          </Text>
        </Text>
        <Sidebar.Search
          aria-label={t("findPage")}
          clearIndicator={<XIcon />}
          clearLabel={t("clearFilter")}
          placeholder={t("filter")}
          searchIndicator={<SearchIcon />}
          shortcut="k"
        />
      </Sidebar.Header>
      <Sidebar.Content>
        {BLOCKS.map(({ label, rows }, at) => (
          <Fragment key={label}>
            {at > 0 && <Sidebar.Separator />}
            <Sidebar.Nav>
              <Sidebar.NavLabel as="h3">{t(label)}</Sidebar.NavLabel>
              {label === "projects" && (
                <>
                  <Sidebar.NavAction aria-label={t("newProject")}>
                    <PlusIcon />
                  </Sidebar.NavAction>
                  <Sidebar.Search
                    aria-label={t("filterProjects")}
                    clearIndicator={<XIcon />}
                    clearLabel={t("clearFilter")}
                    placeholder={t("filterProjectsHint")}
                  />
                </>
              )}
              <NavList.Root>
                {rows.map(([row, Glyph]) => (
                  <NavList.Item key={row}>
                    <NavList.Link
                      aria-current={row === "runs" ? "page" : undefined}
                      href={`#${row}`}
                      tooltip={t(row)}
                    >
                      <Glyph />
                      <span>{t(row)}</span>
                    </NavList.Link>
                  </NavList.Item>
                ))}
              </NavList.Root>
              <Sidebar.Empty>{t(`${label}Empty`)}</Sidebar.Empty>
            </Sidebar.Nav>
          </Fragment>
        ))}
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
  );
}
