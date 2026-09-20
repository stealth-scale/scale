import { type ReactElement } from "react";

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  createAppRootRoute,
  createMemoryHistory,
  createRouter,
  routeMap,
  routerOptions,
  RouterProvider,
} from "@stealthscale/provider-router";
import { drawn } from "@stealthscale/testing-react";
import { COLOR_MODE_ATTRIBUTE, THEME_ATTRIBUTE } from "@stealthscale/theme";

import { useFrame } from "#device/frame.ts";
import { type Framable } from "#device/scene.ts";

const SCENE: Framable = { page: "actions/button", path: "framed", scene: 2, title: "Sizes" };

/**
 * Writes the location the hook resolves into the document, for a case to read.
 */
function Located(): ReactElement {
  return <output>{useFrame(SCENE, {}).src}</output>;
}

describe("useFrame", () => {
  it("addresses the sample by the page and the scene and the pick", () => {
    const { result } = renderHook(() => useFrame(SCENE, { across: 1, value: 2 }));

    expect(result.current.address).toBe("#actions/button/2?v=2&x=1");
  });

  it("loads the framed page at the sample's address from the root where no router is above it", () => {
    const { result } = renderHook(() => useFrame(SCENE, {}));

    expect(result.current.src).toBe("/framed#actions/button/2");
  });

  it("loads the framed page under the base the router serves the application at", async () => {
    const root = createAppRootRoute()({ component: Located });
    const router = createRouter({
      ...routerOptions({ routes: routeMap(root) }),
      basepath: "/docs",
      history: createMemoryHistory({ initialEntries: ["/docs/"] }),
      routeTree: root,
    });

    await router.load();

    const { getByRole } = await drawn(<RouterProvider router={router} />);

    expect(getByRole("status").textContent).toBe("/docs/framed#actions/button/2");
  });

  it("keys the frame by the theme and the mode and the language on the document root", async () => {
    const { result } = renderHook(() => useFrame(SCENE, {}));

    await act(async () => {
      document.documentElement.setAttribute(THEME_ATTRIBUTE, "ink");
      document.documentElement.setAttribute(COLOR_MODE_ATTRIBUTE, "dark");
      document.documentElement.setAttribute("lang", "nl");
      await Promise.resolve();
    });

    expect(result.current.key).toBe("ink/dark/nl");

    await act(async () => {
      document.documentElement.removeAttribute(THEME_ATTRIBUTE);
      document.documentElement.removeAttribute(COLOR_MODE_ATTRIBUTE);
      document.documentElement.removeAttribute("lang");
      await Promise.resolve();
    });
  });
});
