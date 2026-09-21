/**
 * Specifies how a departure reaches the lint block and what it carries there.
 */

import { type ConfigEnv, type UserConfig } from "vite";
import { describe, expect, it } from "vitest";

import { defineConfig, type Layer, owned, remove } from "@stealthscale/vite-config-core";

import {
  barrelled,
  composed,
  defaultExported,
  forbid,
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
  it("appends to the block's overrides rather than replacing them", () => {
    const held = forbid({ because: "a reason", files: ["core/**"], packages: ["@scope/tool-*"] });

    expect(held).toMatchObject({ at: "lint.overrides", kind: "contribution" });
  });

  it("refuses the patterns a tier may not reach for", () => {
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

  it("lets an exception back in", () => {
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

  it("shows the reason as the message the author sees", () => {
    const held = forbid({
      because: "a tool builds on core, so core reaches for no tool",
      files: ["core/**"],
      packages: ["@scope/tool-*"],
    });

    expect(JSON.stringify(held.item)).toContain("so core reaches for no tool");
  });

  it("names itself by the paths it covers", () => {
    expect(forbid({ because: "b", files: ["core/**", "themes/**"], packages: ["x"] }).name).toBe(
      "lint.forbid(core/**, themes/**)",
    );
  });

  it("relaxes the rules a path is held to", () => {
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

  it("copies the globs it was handed", () => {
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

  it("keeps both where two cover the same paths", async () => {
    const held = await readBack({
      extends: [
        relax({ because: "one", files: ["src/**"], rules: { "no-console": "off" } }),
        relax({ because: "two", files: ["src/**"], rules: { "max-lines": "off" } }),
      ],
    });

    expect(overridesOf(held)).toHaveLength(2);
  });

  it("keeps what several packages each contribute", async () => {
    const held = await readBack({ extends: [react(), paraglide()] });

    expect(overridesOf(held).map((one) => Object.keys(one.rules))).toStrictEqual([
      ["no-default-export"],
      ["max-lines"],
    ]);
  });

  it("keeps a repository's own contribution beside them", async () => {
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

  it("excuses exactly the globs it is handed", () => {
    const held = defaultExported(["**/*.config.ts", "**/*.stories.tsx"]).item as {
      files: string[];
    };

    expect(held.files).toStrictEqual(["**/*.config.ts", "**/*.stories.tsx"]);
  });

  it("turns off the rule a default export would break", () => {
    const held = defaultExported(["**/*.config.ts"]).item as { rules: Record<string, unknown> };

    expect(held.rules).toStrictEqual({ "no-default-export": "off" });
  });

  it("excuses a specification exactly the globs it is handed", () => {
    const held = undocumented(["**/*.bench.ts"]).item as { files: string[] };

    expect(held.files).toStrictEqual(["**/*.bench.ts"]);
  });

  it("holds a specification to three times the lines of a source file", () => {
    const held = undocumented(["**/*.spec.ts"]).item as { rules: Record<string, unknown> };

    expect(held.rules["max-lines"]).toStrictEqual([
      "error",
      { max: 900, skipBlankLines: true, skipComments: true },
    ]);
  });

  it("caps no function inside a specification", () => {
    const held = undocumented(["**/*.spec.ts"]).item as { rules: Record<string, unknown> };

    expect(held.rules["max-lines-per-function"]).toBe("off");
  });

  it("turns off the dependency cap for a barrel", () => {
    const held = barrelled(["**/index.ts"]).item as {
      files: string[];
      rules: Record<string, unknown>;
    };

    expect(held.files).toStrictEqual(["**/index.ts"]);
    expect(held.rules).toStrictEqual({ "import/max-dependencies": "off" });
  });

  it("turns off the dependency cap for a fixture", () => {
    const held = composed(["**/*.fixtures.tsx"]).item as {
      files: string[];
      rules: Record<string, unknown>;
    };

    expect(held.files).toStrictEqual(["**/*.fixtures.tsx"]);
    expect(held.rules).toStrictEqual({ "import/max-dependencies": "off" });
  });

  it("names each delegating factory for the call a consumer writes", () => {
    expect(defaultExported(["**/*.config.ts"]).name).toBe("lint.defaultExported(**/*.config.ts)");
    expect(undocumented(["**/*.spec.ts"]).name).toBe("lint.undocumented(**/*.spec.ts)");
    expect(barrelled(["**/index.ts"]).name).toBe("lint.barrelled(**/index.ts)");
    expect(composed(["**/*.fixtures.tsx"]).name).toBe("lint.composed(**/*.fixtures.tsx)");
  });

  it("lets a repository add its own beside the preset's", async () => {
    const held = await readBack({
      extends: [defaultExported(["**/*.config.ts"]), defaultExported(["**/*.stories.tsx"])],
    });

    expect(overridesOf(held).map((one) => one.files)).toStrictEqual([
      ["**/*.config.ts"],
      ["**/*.stories.tsx"],
    ]);
  });
});
