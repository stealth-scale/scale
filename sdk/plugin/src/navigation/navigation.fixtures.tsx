import { type ReactNode } from "react";

import { Outlet } from "@stealthscale/provider-router";

import { timeOffContract } from "#host/product.fixtures.ts";
import { type NavigationEntry, useNavigation } from "#navigation/menus.ts";
import { useDocumentTitle } from "#navigation/title.ts";

function Links({ entries }: { readonly entries: readonly NavigationEntry[] }): ReactNode {
  return (
    <ul>
      {entries.map(({ href, label, routeId }) => (
        <li key={routeId}>
          <a href={href}>{label}</a>
        </li>
      ))}
    </ul>
  );
}

export function MainMenu(): ReactNode {
  return <Links entries={useNavigation()} />;
}

export function TabsMenu(): ReactNode {
  return <Links entries={useNavigation(timeOffContract.menus.tabs)} />;
}

export function RequestsPage(): ReactNode {
  useDocumentTitle("Requests");

  return <Outlet />;
}

export function RequestPage(): ReactNode {
  useDocumentTitle("Request 7");

  return null;
}
