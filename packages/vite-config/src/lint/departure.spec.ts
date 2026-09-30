/**
 * Covers how a departure reaches the lint block and what it puts there.
 */

import { type ConfigEnv, type UserConfig } from "vite";
import { describe, expect, it } from "vitest";

import { defineConfig, type Layer, owned, remove } from "@stealthscale/vite-config-core";

import {
  barrelled,
  composed,
  defaultExported,
  forbid,
  registered,
  relax,
  undocumented,
} from "#lint/departure.ts";

const AT = import.meta.dirname;

const BUILDING: ConfigEnv = { command: "build", mode: "production" };

function readBack(config: Parameters<typeof defineConfig>[1]): Promise<UserConfig> {
  const held = defineConfig(AT, config) as (given: ConfigEnv) => Promise<UserConfig>;

  return held(BUILDING);
}

interface Held {
  files: string[];

  rules: Record<string, unknown>;
}

function overridesOf(config: UserConfig): readonly Held[] {
  return (config.lint?.overrides ?? []) as readonly Held[];
}

function react(): readonly Layer[] {
  return owned("react", [
    relax({
      because: "a component file is read by its default export",
      files: ["**/*.tsx"],
      rules: { "no-default-export": "off" },
    }),
  ]);
}

function paraglide(): readonly Layer[] {
  return owned("paraglide", [
    relax({
      because: "the compiler writes these, so nothing here is anybody's to fix",
      files: ["**/*.tsx"],
      rules: { "max-lines": "off" },
    }),
  ]);
}

describe("departure", () => {
  it("contributes forbid to lint.overrides", () => {
    const held = forbid({ because: "a reason", files: ["core/**"], packages: ["@scope/tool-*"] });

    expect(held).toMatchObject({ at: "lint.overrides", kind: "contribution" });
  });

  it("turns the packages forbid is given into a restricted-import pattern", () => {
    const held = forbid({ because: "a reason", files: ["core/**"], packages: ["@scope/tool-*"] });

    expect(held.item).toStrictEqual({
      files: ["core/**"],
      rules: {
        "no-restricted-imports": [
          "error",
          { patterns: [{ group: ["@scope/tool-*"], message: "a reason" }] },
        ],
      },
    });
  });

  it("adds each exception to the group as a negated pattern", () => {
    const held = forbid({
      because: "a reason",
      except: ["@scope/tool-fixtures"],
      files: ["core/**"],
      packages: ["@scope/tool-*"],
    });

    expect(held.item).toMatchObject({
      rules: {
        "no-restricted-imports": [
          "error",
          { patterns: [{ group: ["@scope/tool-*", "!@scope/tool-fixtures"] }] },
        ],
      },
    });
  });

  it("sets the reason as the restricted-import message", () => {
    const held = forbid({
      because: "a tool builds on core, so core reaches for no tool",
      files: ["core/**"],
      packages: ["@scope/tool-*"],
    });

    expect(JSON.stringify(held.item)).toContain("so core reaches for no tool");
  });

  it("names forbid for the globs it covers", () => {
    expect(forbid({ because: "b", files: ["core/**", "themes/**"], packages: ["x"] }).name).toBe(
      "lint.forbid(core/**, themes/**)",
    );
  });

  it("contributes the globs and rules relax is given", () => {
    const held = relax({
      because: "a config is read by its default export",
      files: ["**/*.config.ts"],
      rules: { "no-default-export": "off" },
    });

    expect(held.item).toStrictEqual({
      files: ["**/*.config.ts"],
      rules: { "no-default-export": "off" },
    });
  });

  it("copies the globs array so a later push cannot reach the contribution", () => {
    const files = ["x"];
    const held = relax({ because: "b", files, rules: {} });
    files.push("y");

    expect((held.item as { files: string[] }).files).toStrictEqual(["x"]);
  });

  it("appends contributions in the order they were written", async () => {
    const held = await readBack({
      extends: [
        forbid({ because: "b", files: ["core/**"], packages: ["x"] }),
        relax({ because: "b", files: ["**/*.config.ts"], rules: { "no-default-export": "off" } }),
        forbid({ because: "b", files: ["themes/**"], packages: ["y"] }),
      ],
    });

    expect(overridesOf(held).map((one) => one.files)).toStrictEqual([
      ["core/**"],
      ["**/*.config.ts"],
      ["themes/**"],
    ]);
  });

  it("keeps two contributions covering the same globs", async () => {
    const held = await readBack({
      extends: [
        relax({ because: "one", files: ["src/**"], rules: { "no-console": "off" } }),
        relax({ because: "two", files: ["src/**"], rules: { "max-lines": "off" } }),
      ],
    });

    expect(overridesOf(held)).toHaveLength(2);
  });

  it("keeps the contribution of each package", async () => {
    const held = await readBack({ extends: [react(), paraglide()] });

    expect(overridesOf(held).map((one) => Object.keys(one.rules))).toStrictEqual([
      ["no-default-export"],
      ["max-lines"],
    ]);
  });

  it("keeps a repository's contribution with those of the packages", async () => {
    const held = await readBack({
      extends: [
        react(),
        paraglide(),
        forbid({ because: "ours", files: ["src/**"], packages: ["@scope/tool-*"] }),
      ],
    });

    expect(overridesOf(held)).toHaveLength(3);
  });

  it("removes one package's contribution by name", async () => {
    const held = await readBack({
      extends: [
        react(),
        paraglide(),
        remove({ because: "b", name: "x", target: "react/lint.relax(**/*.tsx)" }),
      ],
    });

    expect(overridesOf(held).map((one) => Object.keys(one.rules))).toStrictEqual([["max-lines"]]);
  });

  it("contributes the globs defaultExported is given", () => {
    const held = defaultExported(["**/*.config.ts", "**/*.stories.tsx"]).item as {
      files: string[];
    };

    expect(held.files).toStrictEqual(["**/*.config.ts", "**/*.stories.tsx"]);
  });

  it("turns no-default-export off for the globs defaultExported covers", () => {
    const held = defaultExported(["**/*.config.ts"]).item as { rules: Record<string, unknown> };

    expect(held.rules).toStrictEqual({ "no-default-export": "off" });
  });

  it("contributes the globs undocumented is given", () => {
    const held = undocumented(["**/*.bench.ts"]).item as { files: string[] };

    expect(held.files).toStrictEqual(["**/*.bench.ts"]);
  });

  it("caps a specification at 900 lines", () => {
    const held = undocumented(["**/*.spec.ts"]).item as { rules: Record<string, unknown> };

    expect(held.rules["max-lines"]).toStrictEqual([
      "error",
      { max: 900, skipBlankLines: true, skipComments: true },
    ]);
  });

  it("leaves a function inside a specification uncapped", () => {
    const held = undocumented(["**/*.spec.ts"]).item as { rules: Record<string, unknown> };

    expect(held.rules["max-lines-per-function"]).toBe("off");
  });

  it("turns import/max-dependencies off for a barrel", () => {
    const held = barrelled(["**/index.ts"]).item as {
      files: string[];
      rules: Record<string, unknown>;
    };

    expect(held.files).toStrictEqual(["**/index.ts"]);
    expect(held.rules).toStrictEqual({ "import/max-dependencies": "off" });
  });

  it("turns import/max-dependencies off for a fixture", () => {
    const held = composed(["**/*.fixtures.tsx"]).item as {
      files: string[];
      rules: Record<string, unknown>;
    };

    expect(held.files).toStrictEqual(["**/*.fixtures.tsx"]);
    expect(held.rules).toStrictEqual({ "import/max-dependencies": "off" });
  });

  it("turns import/max-dependencies off for a preset", () => {
    const held = registered(["**/src/theme.ts"]).item as {
      files: string[];
      rules: Record<string, unknown>;
    };

    expect(held.files).toStrictEqual(["**/src/theme.ts"]);
    expect(held.rules).toStrictEqual({ "import/max-dependencies": "off" });
  });

  it("names each factory for the call that produced it", () => {
    expect(defaultExported(["**/*.config.ts"]).name).toBe("lint.defaultExported(**/*.config.ts)");
    expect(undocumented(["**/*.spec.ts"]).name).toBe("lint.undocumented(**/*.spec.ts)");
    expect(barrelled(["**/index.ts"]).name).toBe("lint.barrelled(**/index.ts)");
    expect(composed(["**/*.fixtures.tsx"]).name).toBe("lint.composed(**/*.fixtures.tsx)");
    expect(registered(["**/src/theme.ts"]).name).toBe("lint.registered(**/src/theme.ts)");
  });

  it("keeps both contributions when a repository states defaultExported twice", async () => {
    const held = await readBack({
      extends: [defaultExported(["**/*.config.ts"]), defaultExported(["**/*.stories.tsx"])],
    });

    expect(overridesOf(held).map((one) => one.files)).toStrictEqual([
      ["**/*.config.ts"],
      ["**/*.stories.tsx"],
    ]);
  });
});
