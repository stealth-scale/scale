import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { withoutManifest } from "#host/host.fixtures.ts";
import { PRODUCT } from "#host/product.fixtures.ts";
import { loadPage } from "#routes/page.ts";
import { routed } from "#routes/routed.fixtures.tsx";
import {
  failInvoicesOnce,
  INVOICES,
  preloading,
  routeIn,
  SCOPED_PAGE,
} from "#routes/routes.fixtures.ts";

describe("page", () => {
  it("renders a plugin's page in its plugin's scope", async () => {
    await routed({ at: "/invoices", routes: SCOPED_PAGE });

    expect(screen.getByText("scope billing")).toBeTruthy();
  });

  it("records the extensions around the page in the mounted store", async () => {
    const { host } = await routed({ at: "/invoices" });

    expect(host.stores.mounted.get().get(INVOICES)).toStrictEqual([
      { dropped: {}, match: undefined, rendered: [] },
    ]);
  });

  it("returns the route's count of failed renders to zero after the page commits", async () => {
    const { host } = await routed({
      at: "/invoices",
      host: { quarantineAfter: 2 },
      prepare: failInvoicesOnce,
    });

    failInvoicesOnce(host);

    expect(host.stores.quarantine.get().has(INVOICES)).toBe(false);
  });

  it("imports the modules of the plugins whose extensions load with the page", async () => {
    const [routes, load] = preloading();

    await routed({ at: "/time-off", routes });

    expect(load).toHaveBeenCalledExactlyOnceWith();
  });

  it("rejects where no installed manifest maps the route to code", async () => {
    await expect(
      loadPage(withoutManifest(PRODUCT, "billing"), routeIn(PRODUCT, "billing/invoices")),
    ).rejects.toThrow("No manifest maps the route billing/invoices to code.");
  });
});
