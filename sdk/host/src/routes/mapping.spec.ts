import { describe, expect, it } from "vitest";

import { withoutManifest } from "#host/host.fixtures.ts";
import { page, PRODUCT } from "#host/product.fixtures.ts";
import { componentOf, mappingOf } from "#routes/mapping.ts";
import { Broken, Mended, Overview } from "#routes/pages.fixtures.tsx";
import { GUARDED, MENDED, OPEN_TAB } from "#routes/routes.fixtures.ts";

describe("mapping", () => {
  it("returns the page a manifest states as an importer alone", async () => {
    const mapping = mappingOf(PRODUCT, "billing/invoices");

    expect(mapping.fallback).toBeUndefined();
    await expect(mapping.component?.()).resolves.toStrictEqual({ page });
  });

  it("returns the page a manifest states in an entry", async () => {
    await expect(mappingOf(MENDED, "billing/invoices").component?.()).resolves.toStrictEqual({
      Broken,
    });
  });

  it("returns the fallback a manifest states in an entry", async () => {
    await expect(mappingOf(MENDED, "billing/invoices").fallback?.()).resolves.toStrictEqual({
      Mended,
    });
  });

  it("returns the search validator the route's contract states", () => {
    expect(mappingOf(GUARDED, "identity/account").search).toBe(OPEN_TAB);
  });

  it("maps nothing for a route whose plugin has no manifest", () => {
    expect(mappingOf(withoutManifest(PRODUCT, "billing"), "billing/invoices")).toStrictEqual({
      component: undefined,
      fallback: undefined,
      search: undefined,
    });
  });

  it("returns the one function a page's module exports", () => {
    expect(componentOf({ Overview }, "billing/invoices")).toBe(Overview);
  });

  it("throws for a page's module that exports two functions", () => {
    expect(() => componentOf({ Mended, Overview }, "billing/invoices")).toThrow(
      "The module of billing/invoices exports 2 functions, and a page's module exports one.",
    );
  });
});
