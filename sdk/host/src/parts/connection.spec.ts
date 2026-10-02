import { getI18n } from "react-i18next";
import { describe, expect, it, vi } from "vitest";

import { billingContract, timeOffContract } from "#host/product.fixtures.ts";
import { connectionOf } from "#parts/connection.ts";
import { loadedAt, named } from "#parts/parts.fixtures.tsx";

describe("connectionOf", () => {
  it("returns the declared routes the router matched outermost first", async () => {
    const { router } = await loadedAt("/time-off/7");

    expect(connectionOf(router, getI18n()).matched()).toStrictEqual([
      "time-off/overview",
      "time-off/request",
    ]);
  });

  it("navigates to a route with the parameters its path names", async () => {
    const { router } = await loadedAt("/invoices");

    await connectionOf(router, getI18n()).navigate(timeOffContract.routes.request, {
      params: { id: "9" },
    });

    expect(router.state.location.pathname).toBe("/time-off/9");
  });

  it("navigates with the search beside the path", async () => {
    const { router } = await loadedAt("/time-off");

    await connectionOf(router, getI18n()).navigate(billingContract.routes.invoices, {
      search: { tab: "closed" },
    });

    expect(router.state.location.href).toBe("/invoices?tab=closed");
  });

  it("rejects a route the router's map lacks", async () => {
    const { router } = await loadedAt("/invoices");

    await expect(
      connectionOf(router, getI18n()).navigate({ id: "audit/log", kind: "route" }),
    ).rejects.toThrow("No route is declared with the id audit/log.");
  });

  it("translates a key of a namespace's catalogue", async () => {
    named();

    const { router } = await loadedAt("/invoices");

    expect(connectionOf(router, getI18n()).translate("billing", "plugin.name")).toBe("Billing");
  });

  it("runs beforeLoad again for every matched route", async () => {
    const { router } = await loadedAt("/invoices");
    const invalidate = vi.spyOn(router, "invalidate");

    connectionOf(router, getI18n()).invalidate();

    expect(invalidate).toHaveBeenCalledExactlyOnceWith();
  });
});
