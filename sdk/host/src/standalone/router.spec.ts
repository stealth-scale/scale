import { describe, expect, it } from "vitest";

import { createHost } from "#host/create-host.ts";
import { optionsOf } from "#host/host.fixtures.ts";
import { standaloneRouter } from "#standalone/router.ts";
import { LONELY, WORKBENCH } from "#standalone/workbench.fixtures.tsx";

async function routerAt(at: string, product = WORKBENCH): Promise<string> {
  window.history.replaceState(null, "", at);
  standaloneRouter(createHost(optionsOf({ product })), product);

  await new Promise<void>((resolve) => {
    setTimeout(resolve, 0);
  });

  return window.location.pathname;
}

describe("standaloneRouter", () => {
  it("opens a page at the root at the plugin's first menu entry", async () => {
    await expect(routerAt("/")).resolves.toBe("/time-off");
  });

  it("keeps the address a page opened at", async () => {
    await expect(routerAt("/invoices")).resolves.toBe("/invoices");
  });

  it("keeps the root for a plugin without a route", async () => {
    await expect(routerAt("/", LONELY)).resolves.toBe("/");
  });

  it("maps each declared route's id to its route", () => {
    window.history.replaceState(null, "", "/time-off");

    const { routes } = standaloneRouter(createHost(optionsOf({ product: WORKBENCH })), WORKBENCH);

    expect(routes.has("time-off/request")).toBe(true);
  });
});
