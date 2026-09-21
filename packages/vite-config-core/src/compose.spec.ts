/**
 * Covers which layers survive a removal and what each pass contributes.
 */

import { describe, expect, it, vi } from "vitest";

import { resolved, resolvingMetadata, surviving } from "#compose.ts";
import { BUILDING } from "#core.fixtures.ts";
import { contribute, type Contribution, preset, type Removal, remove } from "#layer.ts";

/**
 * Builds a contribution whose name is also the item it appends.
 *
 * @remarks
 *   The two are the same string so an assertion can read the surviving names
 *   and the appended items interchangeably.
 */
function added(name: string): Contribution {
  return contribute({ at: "test.setupFiles", because: "a reason", item: name, name });
}

/**
 * Builds a removal aimed at one name, called after the name it takes back.
 */
function taken(target: string): Removal {
  return remove({ because: "a reason", name: `without(${target})`, target });
}

describe("compose", () => {
  it("keeps every contribution no removal took back", () => {
    const held = surviving([added("a"), added("b")]);

    expect(held.map((one) => one.name)).toStrictEqual(["a", "b"]);
  });

  it("keeps a preset", () => {
    const held = surviving([preset({ config: {}, name: "base" }), added("a")]);

    expect(held.map((one) => one.name)).toStrictEqual(["base", "a"]);
  });

  it("removes a preset by name", () => {
    const held = surviving([preset({ config: {}, name: "base" }), added("a"), taken("base")]);

    expect(held.map((one) => one.name)).toStrictEqual(["a"]);
  });

  it("removes the contribution a removal names", () => {
    const held = surviving([added("a"), added("b"), taken("a")]);

    expect(held.map((one) => one.name)).toStrictEqual(["b"]);
  });

  it("removes the nearest contribution above it", () => {
    const held = surviving([added("a"), taken("a"), added("a")]);

    expect(held.map((one) => one.name)).toStrictEqual(["a"]);
  });

  it("throws for a removal naming nothing contributed above it", () => {
    expect(() => surviving([taken("a"), added("a")])).toThrow(/written too early/u);
  });

  it("throws for a removal naming nothing", () => {
    expect(() => surviving([added("a"), taken("z")])).toThrow(/nothing above it stated/u);
  });

  it("orders a preset asking to go last after one that declared no order", async () => {
    const held = await resolved(BUILDING, [
      preset({ config: { mode: "last" }, enforce: "post", name: "after" }),
      preset({ config: { mode: "first" }, name: "before" }),
    ]);

    expect(held.mode).toBe("last");
  });

  it("appends what a contribution declares outright", async () => {
    const held = await resolved(BUILDING, [
      contribute({ at: "test.setupFiles", because: "a reason", item: "stated.ts", name: "one" }),
    ]);

    expect(held.test?.setupFiles).toStrictEqual(["stated.ts"]);
  });

  it("appends what a contribution derives from the config", async () => {
    const held = await resolved(BUILDING, [
      contribute({
        at: "test.setupFiles",
        because: "a reason",
        itemOf: (context) => `${context.mode}.ts`,
        name: "one",
      }),
    ]);

    expect(held.test?.setupFiles).toStrictEqual(["production.ts"]);
  });

  it("passes over a Vite plugin contribution while the toolchain reads metadata alone", async () => {
    let constructed = 0;

    vi.stubEnv("VP_RESOLVING_CONFIG_METADATA", "1");

    const held = await resolved(BUILDING, [
      contribute({
        at: "plugins",
        because: "a reason",
        itemOf: () => {
          constructed += 1;

          return { name: "plugin" };
        },
        name: "one",
      }),
      contribute({ at: "test.setupFiles", because: "a reason", item: "stated.ts", name: "three" }),
    ]);

    expect(resolvingMetadata()).toBe(true);
    expect(constructed).toBe(0);
    expect(held.plugins).toBeUndefined();
    expect(held.test?.setupFiles).toStrictEqual(["stated.ts"]);
  });

  it("constructs a contribution to the packer's plugins while the toolchain reads metadata", async () => {
    vi.stubEnv("VP_RESOLVING_CONFIG_METADATA", "1");

    const held = await resolved(BUILDING, [
      contribute({
        at: "pack.plugins",
        because: "a reason",
        itemOf: () => ({ name: "packed" }),
        name: "one",
      }),
    ]);

    expect(held.pack).toStrictEqual({ plugins: [{ name: "packed" }] });
  });

  it("appends a plugin contribution while the toolchain runs a command", async () => {
    vi.stubEnv("VP_RESOLVING_CONFIG_METADATA", "0");

    const held = await resolved(BUILDING, [
      contribute({ at: "plugins", because: "a reason", item: { name: "plugin" }, name: "one" }),
    ]);

    expect(resolvingMetadata()).toBe(false);
    expect(held.plugins).toStrictEqual([{ name: "plugin" }]);
  });

  it("prefers the derived value when a layer declares both", async () => {
    const held = await resolved(BUILDING, [
      contribute({
        at: "test.setupFiles",
        because: "a reason",
        item: "stated.ts",
        itemOf: () => "worked-out.ts",
        name: "one",
      }),
    ]);

    expect(held.test?.setupFiles).toStrictEqual(["worked-out.ts"]);
  });
});
