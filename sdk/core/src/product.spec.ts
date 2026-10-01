import { describe, expect, it } from "vitest";

import { timeOffContract } from "#define.fixtures.ts";
import { hostContract } from "#host.ts";
import { plain, region, timeOff } from "#product.fixtures.ts";
import { defineProduct, installed } from "#product.ts";

describe("product", () => {
  it("installs a plugin with the options a product states", () => {
    expect(installed(timeOff, { eager: true, locked: true })).toStrictEqual({
      eager: true,
      locked: true,
      manifest: timeOff,
    });
  });

  it("installs a plugin without options", () => {
    expect(installed(timeOff)).toStrictEqual({ manifest: timeOff });
  });

  it("installs a plugin with the configuration its schema requires", () => {
    expect(installed(region, { config: { region: "eu" } }).config).toStrictEqual({ region: "eu" });
  });

  it("requires a configuration where the schema requires a property without a default", () => {
    // @ts-expect-error -- the schema requires `region`, which has no default.
    const plugin = installed(region);

    expect(plugin.config).toBeUndefined();
  });

  it("refuses a configuration value of another kind", () => {
    // @ts-expect-error -- `approvers` is a number.
    const plugin = installed(timeOff, { config: { approvers: "two" } });

    expect(plugin.config).toStrictEqual({ approvers: "two" });
  });

  it("refuses a configuration for a plugin without a schema", () => {
    // @ts-expect-error -- the plugin takes no configuration.
    const plugin = installed(plain, { config: { region: "eu" } });

    expect(plugin.config).toStrictEqual({ region: "eu" });
  });

  it("returns the definition it was given", () => {
    const definition = {
      name: "product.name",
      plugins: [installed(timeOff)],
      productId: "people",
      version: "2026.10.1",
    };

    expect(defineProduct(definition)).toBe(definition);
  });

  it("places an extension in a region by reference", () => {
    const definition = defineProduct({
      name: "product.name",
      plugins: [installed(timeOff)],
      productId: "people",
      slots: [{ add: [timeOffContract.extensions.balance], slot: hostContract.slots.aside }],
      version: "2026.10.1",
    });

    expect(definition.slots?.[0]?.slot.id).toBe("host/aside");
  });
});
