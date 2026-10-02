import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { operationKey } from "@stealthscale/provider-data";
import { routeMap } from "@stealthscale/provider-router";
import { constantSession, NOBODY } from "@stealthscale/sdk-core";

import { OPEN, PRODUCT, REQUEST } from "#host/product.fixtures.ts";
import { routed, treeOf } from "#routes/routed.fixtures.tsx";
import { failInvoicesOnce, GUARDED, SWITCHED, UNGUARDED } from "#routes/routes.fixtures.ts";

describe("createHostRoutes", () => {
  it("renders a plugin's page at its path", async () => {
    await routed({ at: "/invoices" });

    expect(screen.getByText("page")).toBeTruthy();
  });

  it("compiles the host's settings routes beside the plugin routes", () => {
    expect([...routeMap(treeOf(PRODUCT)).keys()].toSorted()).toStrictEqual([
      "billing/invoices",
      "host/settings",
      "host/settings/host/plugins",
      "host/settings/index",
      "host/settings/time-off/time-off",
      "payroll/runs",
      "time-off/overview",
      "time-off/request",
    ]);
  });

  it("renders a page of a plugin a switch turned off as not found with the plugin", async () => {
    await routed({ at: "/invoices", host: { product: SWITCHED } });

    expect(screen.getByRole("status").textContent).toBe(
      JSON.stringify({ plugin: "billing", reason: "off" }),
    );
  });

  it("renders a quarantined page as not found with its target", async () => {
    await routed({ at: "/invoices", host: { quarantineAfter: 1 }, prepare: failInvoicesOnce });

    expect(screen.getByRole("status").textContent).toBe(
      JSON.stringify({ reason: "quarantined", target: "route:billing/invoices" }),
    );
  });

  it("redirects a person who is not signed in to the sign-in page with the address", async () => {
    const { router } = await routed({
      at: "/invoices?tab=open",
      host: { product: GUARDED, session: constantSession(NOBODY) },
    });

    expect(router.state.location.href).toBe("/sign-in?redirect=%2Finvoices%3Ftab%3Dopen");
  });

  it("loads a page's data before the page renders", async () => {
    const { host } = await routed({ at: "/requests/7", host: { product: UNGUARDED } });

    expect(host.data.getQueryData(operationKey(REQUEST, { id: "7" }))).toStrictEqual(OPEN);
  });

  it("measures the first import of a page's plugin", async () => {
    const product = { ...PRODUCT };

    performance.clearMeasures();
    await routed({ at: "/invoices", host: { product } });

    expect(performance.getEntriesByName("stealth:load:billing", "measure")).toHaveLength(1);
  });

  it("validates a page's search with its contract's validator", async () => {
    const { router } = await routed({ at: "/account", host: { product: UNGUARDED } });

    expect(router.state.matches.at(-1)?.search).toStrictEqual({ tab: "open" });
  });
});
