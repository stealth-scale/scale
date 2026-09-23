/**
 * Draws the column of destinations the shell keeps beside its page.
 *
 * @remarks
 *   Written beside the shell's own page rather than in it. The shell holds six other things
 *   already, and a file that names eleven modules is one nobody reads to the end; the column is
 *   the part of it that is a component of its own rather than a region of the shell.
 *   The words are the shell's, because this is the shell's navigation rather than the sidebar
 *   page's own.
 */

import { type ComponentType, type ReactElement } from "react";

import { Building2, CircleUser, CreditCard, FileText, House, Users } from "lucide-react";

import { NavList } from "@stealthscale/component-navigation";
import { useWords } from "@stealthscale/specimen";

import * as Sidebar from "#sidebar/index.ts";

/**
 * The destinations the column lists, each with the mark it is known by.
 */
const DESTINATIONS: ReadonlyArray<readonly [string, ComponentType]> = [
  ["overview", House],
  ["invoices", FileText],
  ["members", Users],
  ["billing", CreditCard],
];

/**
 * Draws the workspace, the destinations under it and who is signed in under those.
 */
export function Navbar(): ReactElement {
  const { t } = useWords("app-shell");

  return (
    <Sidebar.Root size="sm" variant="subtle">
      <Sidebar.Header>
        <Building2 />
        <span>{t("acme")}</span>
      </Sidebar.Header>
      <Sidebar.Content>
        <Sidebar.Nav as="div">
          <Sidebar.NavLabel as="h3">{t("workspace")}</Sidebar.NavLabel>
          <NavList.Root size="sm">
            {DESTINATIONS.map(([of, Glyph], at) => (
              <NavList.Item key={of}>
                <NavList.Link
                  {...(at === 0 ? { "aria-current": "page" as const } : {})}
                  href={`#${of}`}
                >
                  <Glyph />
                  <span>{t(of)}</span>
                </NavList.Link>
              </NavList.Item>
            ))}
          </NavList.Root>
        </Sidebar.Nav>
      </Sidebar.Content>
      <Sidebar.Footer>
        <CircleUser />
        <span>{t("signedIn")}</span>
      </Sidebar.Footer>
    </Sidebar.Root>
  );
}
