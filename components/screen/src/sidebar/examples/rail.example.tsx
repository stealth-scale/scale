import { type ReactElement } from "react";

import {
  Building2Icon,
  CircleUserIcon,
  DatabaseIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  RocketIcon,
} from "lucide-react";

import { NavList } from "@stealthscale/component-navigation";
import { useWords } from "@stealthscale/specimen";

import * as Sidebar from "#sidebar/index.ts";

export function Rail(): ReactElement {
  const { t } = useWords("sidebar");

  return (
    <Sidebar.Root iconic variant="outline">
      <Sidebar.Header>
        <Building2Icon />
        <span>{t("acme")}</span>
      </Sidebar.Header>
      <Sidebar.Content>
        <Sidebar.Nav>
          <Sidebar.NavLabel as="h3">{t("workspace")}</Sidebar.NavLabel>
          <NavList.Root iconic>
            <NavList.Item>
              <NavList.Link aria-current="page" href="#overview">
                <LayoutDashboardIcon />
                <span>{t("overview")}</span>
              </NavList.Link>
            </NavList.Item>
            <NavList.Item>
              <NavList.Link href="#invoices">
                <FileTextIcon />
                <span>{t("invoices")}</span>
              </NavList.Link>
              <NavList.Badge>3</NavList.Badge>
            </NavList.Item>
          </NavList.Root>
        </Sidebar.Nav>
        <Sidebar.Separator />
        <Sidebar.Nav>
          <Sidebar.NavLabel as="h3">{t("projects")}</Sidebar.NavLabel>
          <NavList.Root iconic>
            <NavList.Item>
              <NavList.Link href="#launch">
                <RocketIcon />
                <span>{t("launch")}</span>
              </NavList.Link>
            </NavList.Item>
            <NavList.Item>
              <NavList.Link href="#migration">
                <DatabaseIcon />
                <span>{t("migration")}</span>
              </NavList.Link>
            </NavList.Item>
          </NavList.Root>
        </Sidebar.Nav>
      </Sidebar.Content>
      <Sidebar.Footer>
        <CircleUserIcon />
        <span>{t("signedIn")}</span>
      </Sidebar.Footer>
    </Sidebar.Root>
  );
}
