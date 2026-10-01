import { type UserConfig } from "vite";
import { describe, expect, it } from "vitest";

import { type Override } from "@stealthscale/vite-config-core";

import { chunks } from "#build/chunks.ts";

type Refining = Parameters<Override["refine"]>[0];

interface Group {
  entriesAware?: boolean;
  minShareCount?: number;
  name: string;
  priority?: number;
  tags?: readonly string[];
  test?: RegExp;
}

interface Splitting {
  groups: readonly Group[];
  includeDependenciesRecursively?: boolean;
}

const HERE = new URL("../../", import.meta.url).pathname;

const BUILDING: Refining = {
  at: HERE,
  command: "build",
  env: {},
  manifest: {},
  mode: "production",
  root: HERE,
};

const SERVING: Refining = { ...BUILDING, command: "serve", mode: "development" };

function splitting(context: Refining = BUILDING, config: UserConfig = {}): Splitting {
  const output = chunks().refine(context, config).build?.rolldownOptions?.output as {
    codeSplitting: Splitting;
  };

  return output.codeSplitting;
}

function landing(path: string, context: Refining = BUILDING): string | undefined {
  return splitting(context)
    .groups.toSorted((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
    .find((group) => group.test === undefined || group.test.test(path))?.name;
}

describe("chunks", () => {
  it("matches a react or scheduler module in the framework group", () => {
    expect(landing("/r/node_modules/.pnpm/react-dom@19/node_modules/react-dom/index.js")).toBe(
      "framework",
    );
    expect(landing("/r/node_modules/.pnpm/react@19/node_modules/react/jsx-runtime.js")).toBe(
      "framework",
    );
    expect(landing("/r/node_modules/.pnpm/scheduler@0.27/node_modules/scheduler/index.js")).toBe(
      "framework",
    );
  });

  it("matches another node_modules package in the vendor group", () => {
    expect(
      landing("/r/node_modules/.pnpm/@chakra-ui+react@3/node_modules/@chakra-ui/react/x.js"),
    ).toBe("vendor");
  });

  it("matches no group for an application module", () => {
    expect(landing("/r/apps/docs/src/main.tsx")).toBeUndefined();
    expect(landing("/r/apps/docs/src/other.tsx", SERVING)).toBeUndefined();
  });

  it("states a test on every group", () => {
    expect(splitting().groups.every((group) => group.test !== undefined)).toBe(true);
  });

  it("matches an @stealthscale or workspace module in the library group", () => {
    expect(landing("/r/components/controls/src/index.ts")).toBe("library");
    expect(landing("/r/foundations/theme/generated/css/css.mjs")).toBe("library");
    expect(landing("/r/themes/ink/src/index.ts")).toBe("library");
    expect(landing("/r/packages/pandacss-naming/src/index.ts")).toBe("library");
    expect(
      landing("/r/node_modules/.pnpm/@stealthscale+theme@1/node_modules/@stealthscale/theme/x.js"),
    ).toBe("library");
    expect(landing("/r/node_modules/@stealthscale/component-actions/dist/index.js")).toBe(
      "library",
    );
  });

  it("matches a module under sdk in the library group", () => {
    expect(landing("/r/sdk/core/src/index.ts")).toBe("library");
  });

  it("omits the library group under a dev server", () => {
    expect(splitting(SERVING).groups.map((group) => group.name)).toStrictEqual([
      "framework",
      "vendor",
    ]);
    expect(landing("/r/components/controls/src/index.ts", SERVING)).toBeUndefined();
    expect(landing("/r/node_modules/.pnpm/react@19/node_modules/react/index.js", SERVING)).toBe(
      "framework",
    );
  });

  it("tags every group but shared as $initial", () => {
    const tagged = Object.fromEntries(splitting().groups.map((group) => [group.name, group.tags]));

    expect(tagged).toStrictEqual({
      framework: ["$initial"],
      library: ["$initial"],
      shared: undefined,
      vendor: ["$initial"],
    });
  });

  it("groups a supplied module two entries import into the shared chunk", () => {
    const shared = splitting().groups.find((group) => group.name === "shared");

    expect(shared).toMatchObject({ minShareCount: 2, priority: 3 });
    expect(shared?.test?.test("/r/node_modules/.pnpm/@zag-js+core@1/node_modules/x.js")).toBe(true);
    expect(shared?.test?.test("/r/components/forms/src/switch/root.tsx")).toBe(true);
    expect(shared?.test?.test("/r/apps/docs/src/routes.tsx")).toBe(false);
  });

  it("matches a module under sdk in the shared group", () => {
    const shared = splitting().groups.find((group) => group.name === "shared");

    expect(shared?.test?.test("/r/sdk/plugin/src/slot.tsx")).toBe(true);
  });

  it("omits the shared group under a dev server", () => {
    expect(splitting(SERVING).groups.map((group) => group.name)).not.toContain("shared");
  });

  it("leaves entriesAware unset on every group", () => {
    for (const group of splitting().groups) {
      expect(group.entriesAware).toBeUndefined();
    }
  });

  it("disables includeDependenciesRecursively", () => {
    expect(splitting().includeDependenciesRecursively).toBe(false);
  });

  it("places a group the configuration already states first", () => {
    const named = {
      name: (id: string): null | string => (id.endsWith(".page.ts") ? "page" : null),
    };
    const refined = splitting(BUILDING, {
      build: { rolldownOptions: { output: { codeSplitting: { groups: [named] } } } },
    });

    expect(refined.groups[0]).toBe(named);
    expect(refined.groups.map((group) => group.name)).toHaveLength(5);
  });

  it("keeps the other build options the configuration states", () => {
    const refined = chunks().refine(BUILDING, {
      build: { rolldownOptions: { output: { format: "es" }, treeshake: true }, sourcemap: true },
    });

    expect(refined.build).toMatchObject({
      rolldownOptions: { output: { format: "es" }, treeshake: true },
      sourcemap: true,
    });
  });

  it("returns the configuration unchanged when the output is an array", () => {
    const several: UserConfig = { build: { rolldownOptions: { output: [{ format: "es" }] } } };

    expect(chunks().refine(BUILDING, several)).toBe(several);
  });

  it("names the override build.chunks", () => {
    expect(chunks().name).toBe("build.chunks");
  });

  it("states a reason on the override", () => {
    expect(chunks().because).not.toBe("");
  });
});
