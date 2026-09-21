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
  it("appends to the bundler's plugins rather than replacing them", () => {
    expect(inventory().at).toBe("plugins");
  });

  it("applies to the build and not to the dev server", () => {
    expect(inventory().apply).toBe("build");
  });

  it("names the layer so a repository can remove it", () => {
    expect(inventory().name).toBe("build.inventory");
  });

  it("constructs the plugin when the configuration is composed and not when the layer is stated", () => {
    expect(inventory().item).toBeUndefined();
  });

  it("asks for one copy beside the output and one where a scanner reaches for it", async () => {
    expect((await passed())["paths"]).toStrictEqual(["cyclonedx/bom.json", ".well-known/sbom"]);
  });

  it("asks for a document that describes an application", async () => {
    expect((await passed())["type"]).toBe("application");
  });

  it("supplies the house", async () => {
    expect((await passed())["supplier"]).toStrictEqual({
      name: "Stealth Scale B.V.",
      url: ["https://stealthscale.io"],
    });
  });

  it("supplies the author the repository names instead", async () => {
    const supplier = { name: "Acme", url: ["https://acme.example"] };

    expect((await passed({}, supplier))["supplier"]).toStrictEqual(supplier);
  });

  it("asks for a serial number and a timestamp for a release", async () => {
    const held = await passed({ mode: "production" });

    expect(held["serialNumber"]).toBe(true);
    expect(held["timestamp"]).toBe(true);
  });

  it("asks for neither in development", async () => {
    const held = await passed();

    expect(held["serialNumber"]).toBe(false);
    expect(held["timestamp"]).toBe(false);
  });
});
