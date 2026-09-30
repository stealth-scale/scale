/**
 * Specifies what each tier puts in the block and which departures it brings.
 */

import { type UserConfig } from "vite";
import { describe, expect, it } from "vitest";

import { type Layer, type Preset } from "@stealthscale/vite-config-core";

import { GENERATED } from "#ignore/generated.ts";
import { base, node, web } from "#lint/preset.ts";
import * as rules from "#lint/rules/index.ts";

function blockOf(layers: readonly Layer[]): NonNullable<UserConfig["lint"]> {
  const held = layers.find((one) => one.kind === "preset") as Preset;

  return (held.config as UserConfig).lint as NonNullable<UserConfig["lint"]>;
}

function namesOf(layers: readonly Layer[]): readonly string[] {
  return layers.map((one) => one.name);
}

describe("preset", () => {
  it("sets a block rather than appending to a list", () => {
    expect(base().some((one) => one.kind === "preset")).toBe(true);
  });

  it("names the layer so a repository can remove it", () => {
    expect(namesOf(base())).toContain("lint.base");
    expect(namesOf(node())).toContain("lint.node");
    expect(namesOf(web())).toContain("lint.web");
  });

  it("turns on type-aware linting", () => {
    expect(blockOf(base()).options).toMatchObject({ typeAware: true, typeCheck: true });
  });

  it("fails on a finding rather than warning about it", () => {
    expect(blockOf(base()).categories).toBe(rules.CATEGORIES);
  });

  it("applies every rule group to the package", () => {
    expect(blockOf(base()).rules).toStrictEqual(rules.base());
  });

  it("names the plugins its rules are written against", () => {
    expect(blockOf(base()).plugins).toBe(rules.PLUGINS);
  });

  it("ignores what a tool wrote", () => {
    expect(blockOf(base()).ignorePatterns).toStrictEqual([...GENERATED]);
  });

  it("adds no environment in the base tier", () => {
    expect(blockOf(base()).env).toBeUndefined();
  });

  it("gives a package the console runs node globals and not browser globals", () => {
    expect(blockOf(node()).env).toStrictEqual({ node: true });
  });

  it("gives a package the browser runs browser globals and not node globals", () => {
    expect(blockOf(web()).env).toStrictEqual({ browser: true });
  });

  it("includes everything the base tier does", () => {
    for (const held of [node(), web()]) {
      expect(blockOf(held)).toMatchObject({
        categories: blockOf(base()).categories,
        options: blockOf(base()).options,
        plugins: blockOf(base()).plugins,
      });
    }
  });

  it("excuses a config file and a specification whichever entry was picked", () => {
    for (const held of [base(), node(), web()]) {
      expect(namesOf(held)).toContain("lint.defaultExported(**/*.config.ts, **/src/theme.ts)");
      expect(held.some((one) => one.name.includes("*.spec.ts"))).toBe(true);
    }
  });

  it("excuses a barrel from the dependency cap in every tier", () => {
    for (const held of [base(), node(), web()]) {
      expect(namesOf(held)).toContain("lint.barrelled(**/index.ts)");
    }
  });

  it("excuses a preset from the dependency cap in every tier", () => {
    for (const held of [base(), node(), web()]) {
      expect(namesOf(held)).toContain("lint.registered(**/src/theme.ts)");
    }
  });

  it("excuses no rendered specification when the package runs in the console", () => {
    for (const held of [base(), node()]) {
      expect(held.some((one) => one.name.includes("*.spec.tsx"))).toBe(false);
    }
  });

  it("excuses a rendered specification when the package renders", () => {
    expect(web().some((one) => one.name.includes("*.spec.tsx"))).toBe(true);
  });
});
