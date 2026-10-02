import { fileURLToPath } from "node:url";
import { describe, expect, it, vi } from "vitest";

import { type Context } from "@stealthscale/vite-config-core";

import { type Built } from "#sbom/sbom.fixtures.ts";
import { told } from "#vite.fixtures.ts";

const PLUGIN = "@stealthscale/vite-plugin-sbom";

const FIXTURE = fileURLToPath(new URL("../sbom/sbom.fixtures.ts", import.meta.url));

vi.mock(import("@stealthscale/vite-config-core"), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    located: (specifier: string, from: string): string =>
      specifier === PLUGIN ? FIXTURE : actual.located(specifier, from),
  };
});

const { inventory } = await import("#pack/inventory.ts");

async function passed(
  stated: Partial<Context> = {},
  supplier?: Parameters<typeof inventory>[0],
): Promise<Record<string, unknown>> {
  const plugin: unknown = await inventory(supplier).itemOf?.(told(stated));

  return (plugin as Built).options;
}

describe("inventory", () => {
  it("contributes at the pack.plugins key", () => {
    expect(inventory().at).toBe("pack.plugins");
  });

  it("applies to the build command", () => {
    expect(inventory().apply).toBe("build");
  });

  it("names the contribution pack.inventory", () => {
    expect(inventory().name).toBe("pack.inventory");
  });

  it("constructs the plugin when the configuration is composed", () => {
    expect(inventory().item).toBeUndefined();
  });

  it("names no path and leaves the document where the plugin puts it", async () => {
    await expect(passed()).resolves.not.toHaveProperty("paths");
  });

  it("types the component as a library", async () => {
    expect((await passed())["type"]).toBe("library");
  });

  it("records the house identity as the supplier by default", async () => {
    expect((await passed())["supplier"]).toStrictEqual({
      name: "Stealth Scale B.V.",
      url: ["https://stealthscale.io"],
    });
  });

  it("records the supplier the caller passes", async () => {
    const supplier = { name: "Acme", url: ["https://acme.example"] };

    expect((await passed({}, supplier))["supplier"]).toStrictEqual(supplier);
  });

  it("asks for a serial number when the mode is production", async () => {
    expect((await passed({ mode: "production" }))["serialNumber"]).toBe(true);
  });

  it("asks for a timestamp when the mode is production", async () => {
    expect((await passed({ mode: "production" }))["timestamp"]).toBe(true);
  });

  it("omits the serial number when the mode is development", async () => {
    expect((await passed())["serialNumber"]).toBe(false);
  });

  it("omits the timestamp when the mode is development", async () => {
    expect((await passed())["timestamp"]).toBe(false);
  });
});
