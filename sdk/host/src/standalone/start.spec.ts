import { describe, expect, it } from "vitest";

import { createHost } from "#host/create-host.ts";
import { optionsOf } from "#host/host.fixtures.ts";
import { standaloneRouter } from "#standalone/router.ts";
import { flagsOf, startOf } from "#standalone/start.ts";
import { LONELY, QUIET, WORKBENCH } from "#standalone/workbench.fixtures.tsx";

function startIn(product = WORKBENCH): string | undefined {
  window.history.replaceState(null, "", "/elsewhere");

  const { routes } = standaloneRouter(createHost(optionsOf({ product })), product);

  return startOf(product, routes);
}

describe("startOf", () => {
  it("returns the plugin's first menu entry", () => {
    expect(startIn()).toBe("/time-off");
  });

  it("returns the plugin's first route a sample or an empty path fills where it lists no entry", () => {
    expect(startIn(QUIET)).toBe("/quiet");
  });

  it("returns no address for a plugin without a route", () => {
    expect(startIn(LONELY)).toBeUndefined();
  });

  it("lists every declared flag with the variants of each experiment", () => {
    expect(flagsOf(WORKBENCH)).toStrictEqual([
      { id: "time-off/calendar", variants: undefined },
      { id: "time-off/layout", variants: ["list", "board"] },
      { id: "billing/sync", variants: undefined },
    ]);
  });
});
