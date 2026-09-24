import { type FC, type ReactElement } from "react";

import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";

import { compileRoutes } from "#compile.ts";
import { routeMap } from "#map.ts";
import { routerOptions } from "#options.ts";
import { createAppRootRoute } from "#root.ts";
import { createMemoryHistory, createRoute, createRouter, RouterProvider } from "#tanstack.ts";

const MODULES = import.meta.glob<Readonly<Record<string, FC<{ readonly to: string }>>>>(
  "./examples/*.example.tsx",
  { eager: true },
);

const EXAMPLES = Object.entries(MODULES).flatMap(([path, module]) =>
  Object.entries(module).map(([name, Example]) => [`${path} ${name}`, Example] as const),
);

/**
 * Renders nothing, standing in for a declared route's page.
 *
 * @returns `null`.
 */
function Page(): null {
  return null;
}

/**
 * Builds a loaded router whose root route renders the example, with the catalogue routes the
 * examples link to declared.
 *
 * @param Example - The example component, given a declared route ID as `to`.
 * @returns A component that renders the router.
 */
async function routed(Example: FC<{ readonly to: string }>): Promise<FC> {
  const root = createAppRootRoute()({
    component: (): ReactElement => <Example to="specimen.components.actions.button" />,
  });
  const home = createRoute({ component: Page, getParentRoute: () => root, path: "/" });
  const compiled = compileRoutes(
    [
      { component: Page, id: "specimen.components.actions.button", path: "/actions/button" },
      { component: Page, id: "specimen.components.forms.input", path: "/forms/input" },
    ],
    { parent: root },
  );
  const tree = root.addChildren([home, ...compiled]);
  const router = createRouter({
    ...routerOptions({ routes: routeMap(tree) }),
    history: createMemoryHistory({ initialEntries: ["/"] }),
    routeTree: tree,
  });

  await router.load();

  return function Routed(): ReactElement {
    return <RouterProvider router={router} />;
  };
}

describe("examples", () => {
  it("finds at least one example file", () => {
    expect(EXAMPLES.length).toBeGreaterThan(0);
  });

  it.each(EXAMPLES)("returns no accessibility violation for %s", async (_name, Example) => {
    await expect(accessibilityViolations(await routed(Example))).resolves.toStrictEqual([]);
  });
});
