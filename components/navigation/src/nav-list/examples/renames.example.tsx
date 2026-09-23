import { type ReactElement } from "react";

import {
  CreditCardIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  PencilIcon,
  UsersIcon,
} from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as NavList from "#nav-list/index.ts";

export function Renames(props: NavList.RootProps): ReactElement {
  const { t } = useWords("nav-list");

  return (
    <NavList.Root {...props}>
      <NavList.Item>
        <NavList.Link aria-current="page" href="#overview">
          <LayoutDashboardIcon aria-hidden />
          <span>{t("overview")}</span>
        </NavList.Link>
        <NavList.Action aria-label={t("rename", { name: t("overview") })}>
          <PencilIcon aria-hidden size="1em" />
        </NavList.Action>
      </NavList.Item>
      <NavList.Item>
        <NavList.Link href="#invoices">
          <FileTextIcon aria-hidden />
          <span>{t("invoices")}</span>
        </NavList.Link>
        <NavList.Action aria-label={t("rename", { name: t("invoices") })}>
          <PencilIcon aria-hidden size="1em" />
        </NavList.Action>
      </NavList.Item>
      <NavList.Item>
        <NavList.Link href="#team">
          <UsersIcon aria-hidden />
          <span>{t("team")}</span>
        </NavList.Link>
        <NavList.Action aria-label={t("rename", { name: t("team") })}>
          <PencilIcon aria-hidden size="1em" />
        </NavList.Action>
      </NavList.Item>
      <NavList.Item>
        <NavList.Link href="#billing">
          <CreditCardIcon aria-hidden />
          <span>{t("billing")}</span>
        </NavList.Link>
        <NavList.Action aria-label={t("rename", { name: t("billing") })}>
          <PencilIcon aria-hidden size="1em" />
        </NavList.Action>
      </NavList.Item>
    </NavList.Root>
  );
}
