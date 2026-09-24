/**
 * Renders the sidebar the app shell's specimen puts in its navbar.
 *
 * @remarks
 *   The words are the app shell's, because this sidebar is the shell's navigation. The block
 *   renders as a `div`, because the page renders seven shells and a `nav` in each would repeat the
 *   landmark name.
 */

import { type ComponentType, type ReactElement } from "react";

import { Building2, CircleUser, CreditCard, FileText, House, Users } from "lucide-react";

import { NavList } from "@stealthscale/component-navigation";
import { useWords } from "@stealthscale/specimen";

import * as Sidebar from "#sidebar/index.ts";

/**
 * Destinations of the sidebar, each with its icon.
 */
const DESTINATIONS: ReadonlyArray<readonly [string, ComponentType]> = [
  ["overview", House],
  ["invoices", FileText],
  ["members", Users],
  ["billing", CreditCard],
];

/**
 * Renders the workspace in the header, the destinations and the signed-in person in the footer.
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
