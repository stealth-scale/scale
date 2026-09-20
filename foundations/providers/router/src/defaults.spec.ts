import { describe, expect, it } from "vitest";

import { routerDefaults } from "#defaults.ts";

describe("routerDefaults", () => {
  it("preloads a route on intent", () => {
    expect(routerDefaults.defaultPreload).toBe("intent");
  });

  it("counts a preloaded route as stale at once", () => {
    expect(routerDefaults.defaultPreloadStaleTime).toBe(0);
  });

  it("restores scroll position on the way back", () => {
    expect(routerDefaults.scrollRestoration).toBe(true);
  });

  it("moves the window in one step rather than with the page's scroll behaviour", () => {
    expect(routerDefaults.scrollRestorationBehavior).toBe("instant");
  });

  it("states no other option", () => {
    expect(Object.keys(routerDefaults)).toStrictEqual([
      "defaultPreload",
      "defaultPreloadStaleTime",
      "scrollRestoration",
      "scrollRestorationBehavior",
    ]);
  });
});
