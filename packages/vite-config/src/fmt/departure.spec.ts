/**
 * Covers the departures a repository can take from the house formatting rules.
 */

import { describe, expect, it } from "vitest";

import { defineConfig, preset } from "@stealthscale/vite-config-core";

import { generated, group, own, skip } from "#fmt/departure.ts";
import { imports } from "#fmt/imports.ts";
import { GENERATED } from "#ignore/generated.ts";
import { readBack } from "#preset/preset.fixtures.ts";

/**
 * Directory the configuration under test configures.
 */
const AT = import.meta.dirname;

/**
 * Composes the layers and returns the import order they resolved to.
 *
 * @remarks
 *   A group is an override, so it applies only once the whole configuration has resolved. Reading
 *   the layer on its own returns nothing.
 * @param layers - The layers to compose, the ones under test last.
 * @returns The resolved `fmt.sortImports` settings.
 */
async function sorted(layers: readonly unknown[]): Promise<Record<string, unknown>> {
  const held = await readBack(defineConfig(AT, { extends: layers as never }));

  return held.fmt?.sortImports as Record<string, unknown>;
}

describe("departure", () => {
  it("returns one contribution per glob", () => {
    const held = skip({ because: "vendored", files: ["a/**", "b/**"] });

    expect(held.map((one) => one.item)).toStrictEqual(["a/**", "b/**"]);
  });

  it("names a skip contribution fmt.skip(glob)", () => {
    expect(skip({ because: "vendored", files: ["a/**"] })[0]?.name).toBe("fmt.skip(a/**)");
  });

  it("targets fmt.ignorePatterns with every skip contribution", () => {
    for (const held of skip({ because: "vendored", files: ["a/**"] })) {
      expect(held.at).toBe("fmt.ignorePatterns");
    }
  });

  it("carries the reason skip() was given", () => {
    expect(skip({ because: "vendored", files: ["a/**"] })[0]?.because).toBe("vendored");
  });

  it("contributes every glob in GENERATED", () => {
    expect(generated().map((one) => one.item)).toStrictEqual([...GENERATED]);
  });

  it("appends the prefix to internalPattern after the house scope", async () => {
    const held = await sorted([imports(), ...own({ because: "ours", patterns: ["@acme/"] })]);

    expect(held["internalPattern"]).toStrictEqual(["@stealthscale/", "@acme/"]);
  });

  it("names an own contribution fmt.own(prefix)", () => {
    const [held] = own({ because: "a second scope", patterns: ["@acme/"] });

    expect(held?.name).toBe("fmt.own(@acme/)");
  });

  it("carries the reason own() was given", () => {
    const [held] = own({ because: "a second scope", patterns: ["@acme/"] });

    expect(held?.because).toBe("a second scope");
  });

  it("sorts a contributed group above every existing group", async () => {
    const held = await sorted([
      imports(),
      group({ because: "renders", name: "react", patterns: ["^react$"] }),
    ]);

    expect((held["groups"] as string[])[0]).toBe("react");
  });

  it("defines the contributed group in customGroups", async () => {
    const held = await sorted([
      imports(),
      group({ because: "renders", name: "react", patterns: ["^react$"] }),
    ]);
    const defined = held["customGroups"] as Array<{
      elementNamePattern: string[];
      groupName: string;
    }>;

    expect(defined[0]).toStrictEqual({ elementNamePattern: ["^react$"], groupName: "react" });
  });

  it("keeps the existing groups beneath the contributed one", async () => {
    const held = await sorted([
      imports(),
      group({ because: "renders", name: "react", patterns: ["^react$"] }),
    ]);

    expect((held["groups"] as unknown[]).at(-1)).toBe("unknown");
  });

  it("defines both groups when two layers each add one", async () => {
    const held = await sorted([
      imports(),
      group({ because: "renders", name: "react", patterns: ["^react$"] }),
      group({ because: "routes", name: "router", patterns: ["^@tanstack/"] }),
    ]);
    const defined = held["customGroups"] as Array<{ groupName: string }>;

    expect(defined.map((one) => one.groupName).toSorted()).toStrictEqual(["react", "router"]);
    expect(held["groups"]).toContain("react");
    expect(held["groups"]).toContain("router");
  });

  it("rejects when no layer above it sorts imports", async () => {
    await expect(
      sorted([group({ because: "renders", name: "react", patterns: ["^react$"] })]),
    ).rejects.toThrow("nothing above it sorts imports");
  });

  it("adds the first group when customGroups is absent", async () => {
    const held = await readBack(
      defineConfig(AT, {
        extends: [
          preset({ config: { fmt: { sortImports: {} } }, name: "bare" }),
          group({ because: "renders", name: "react", patterns: ["react"] }),
        ],
      }),
    );

    expect(held.fmt?.sortImports).toMatchObject({
      customGroups: [{ elementNamePattern: ["react"], groupName: "react" }],
      groups: ["react"],
    });
  });
});
