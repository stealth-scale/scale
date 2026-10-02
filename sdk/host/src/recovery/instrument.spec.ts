import { describe, expect, it } from "vitest";

import { isPending } from "#host/host.fixtures.ts";
import { PRODUCT } from "#host/product.fixtures.ts";
import { everyKind, failing, loading } from "#host/ready.fixtures.ts";
import { instrumented } from "#recovery/instrument.ts";
import {
  codeIn,
  IMPORTERS,
  MIGRATIONS,
  nothing,
  pageOf,
  productWith,
  reloadedBefore,
  reloads,
} from "#recovery/recovery.fixtures.ts";

describe("instrumented", () => {
  it("returns one instrumented product per product object", () => {
    expect(instrumented(PRODUCT)).toBe(instrumented(PRODUCT));
  });

  it("keeps each manifest's contract", () => {
    expect(instrumented(PRODUCT).product.manifests["time-off"]?.contract).toBe(
      PRODUCT.manifests["time-off"]?.contract,
    );
  });

  it("keeps a settings section's migrations", () => {
    const code = codeIn(
      productWith("migrated", { settings: { quiet: { migrations: MIGRATIONS } } }),
    );

    expect(code.settings?.["quiet"]?.migrations).toBe(MIGRATIONS);
  });

  it("leaves out a kind of code the manifest leaves out", () => {
    expect(codeIn(PRODUCT).extensions).toBeUndefined();
  });

  it.each(IMPORTERS)("imports $kind through the manifest's importer", async ({ pick }) => {
    const load = loading();

    await pick(codeIn(productWith("kinds", everyKind(load))))?.();

    expect(load).toHaveBeenCalledExactlyOnceWith();
  });

  it("measures a plugin's first import under the plugin's id", async () => {
    performance.clearMeasures();
    await pageOf(codeIn(productWith("measured", everyKind(loading()))), "request")();

    expect(performance.getEntriesByName("stealth:load:time-off", "measure")).toHaveLength(1);
  });

  it("measures one import per plugin", async () => {
    const code = codeIn(productWith("measured-once", everyKind(loading())));

    performance.clearMeasures();
    await pageOf(code, "request")();
    await pageOf(code, "overview")();

    expect(performance.getEntriesByName("stealth:load:time-off", "measure")).toHaveLength(1);
  });

  it("adds no measure for a first import that rejects", async () => {
    reloadedBefore("unmeasured");
    performance.clearMeasures();
    await pageOf(codeIn(productWith("unmeasured", everyKind(failing()))), "request")().catch(
      () => {},
    );

    expect(performance.getEntriesByName("stealth:load:time-off", "measure")).toHaveLength(0);
  });

  it("reloads the page where an import rejects", async () => {
    const reload = reloads();
    const importing = pageOf(codeIn(productWith("rejected", everyKind(failing()))), "request")();

    await expect(isPending(importing)).resolves.toBe(true);
    expect(reload).toHaveBeenCalledExactlyOnceWith();
  });

  it("rejects with the import's error for a build version it reloaded before", async () => {
    reloadedBefore("rejected-before");

    await expect(
      pageOf(codeIn(productWith("rejected-before", everyKind(failing()))), "request")(),
    ).rejects.toThrow("The chunk is gone.");
  });

  it("reloads the page where an import resolves with no module", async () => {
    const reload = reloads();
    const importing = pageOf(codeIn(productWith("cancelled", everyKind(nothing()))), "request")();

    await expect(isPending(importing)).resolves.toBe(true);
    expect(reload).toHaveBeenCalledExactlyOnceWith();
  });

  it("rejects an import that resolves with no module for a version it reloaded before", async () => {
    reloadedBefore("cancelled-before");

    await expect(
      pageOf(codeIn(productWith("cancelled-before", everyKind(nothing()))), "request")(),
    ).rejects.toThrow("An import of a module of time-off resolved with no module.");
  });
});
