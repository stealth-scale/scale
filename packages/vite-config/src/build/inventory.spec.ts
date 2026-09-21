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

const { inventory } = await import("#build/inventory.ts");

async function passed(
  stated: Partial<Context> = {},
  supplier?: Parameters<typeof inventory>[0],
): Promise<Record<string, unknown>> {
  const plugin: unknown = await inventory(supplier).itemOf?.(told(stated));

  return (plugin as Built).options;
}

describe("inventory", () => {
  it("contributes at the plugins key", () => {
    expect(inventory().at).toBe("plugins");
  });

  it("applies to the build command", () => {
    expect(inventory().apply).toBe("build");
  });

  it("names the contribution build.inventory", () => {
    expect(inventory().name).toBe("build.inventory");
  });

  it("constructs the plugin when the configuration is composed", () => {
    expect(inventory().item).toBeUndefined();
  });

  it("names the output path and the served path", async () => {
    expect((await passed())["paths"]).toStrictEqual(["cyclonedx/bom.json", ".well-known/sbom"]);
  });

  it("types the component as an application", async () => {
    expect((await passed())["type"]).toBe("application");
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
