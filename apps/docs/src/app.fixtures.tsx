/**
 * Renders the catalogue at a path, with everything the frame reads in scope, so a specification
 * reads a screen the way a reader meets it.
 */

import { render, type RenderResult } from "@testing-library/react";
import { catalogues } from "virtual:i18n";

import { RouterProvider } from "@stealthscale/provider-router";
import { Shell } from "@stealthscale/provider-shell";
import { memoryStore } from "@stealthscale/settings";
import { routerOver } from "@stealthscale/testing-router";

import { buildTree } from "#routes.tsx";
import { THEMES } from "#themes.ts";

/**
 * Opens the catalogue at a path.
 *
 * @remarks
 *   A router and a tree of their own each time, and settings kept in memory, so two cases share
 *   nothing. The shell is the application's own, less the storage, because the chrome reads the
 *   colour mode and the theme choice from it and throws outside it.
 * @param at - The path to open.
 * @returns The render, which a query is scoped to.
 */
export async function opened(at: string): Promise<RenderResult> {
  const router = routerOver(buildTree(), at);

  await router.load();

  return render(
    <Shell
      app="docs"
      catalogues={catalogues}
      locales={["en"]}
      store={memoryStore()}
      themes={THEMES}
    >
      <RouterProvider router={router} />
    </Shell>,
  );
}
