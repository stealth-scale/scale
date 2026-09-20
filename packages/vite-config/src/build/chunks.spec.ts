import { type UserConfig } from "vite";
import { describe, expect, it } from "vitest";

import { type Override } from "@stealthscale/vite-config-core";

import { chunks } from "#build/chunks.ts";

type Refining = Parameters<Override["refine"]>[0];

interface Group {
  entriesAware?: boolean;
  name: string;
  priority?: number;
  tags: readonly string[];
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
  it("splits the runtime the dependencies the library and the application into a chunk each", () => {
    expect(landing("/r/node_modules/.pnpm/react-dom@19/node_modules/react-dom/index.js")).toBe(
      "framework",
    );
    expect(landing("/r/node_modules/.pnpm/react@19/node_modules/react/jsx-runtime.js")).toBe(
      "framework",
    );
    expect(landing("/r/node_modules/.pnpm/scheduler@0.27/node_modules/scheduler/index.js")).toBe(
      "framework",
    );
    expect(
      landing("/r/node_modules/.pnpm/@chakra-ui+react@3/node_modules/@chakra-ui/react/x.js"),
    ).toBe("vendor");
    expect(landing("/r/apps/docs/src/main.tsx")).toBe("app");
  });

  it("groups the house's own packages into the library wherever they were resolved from", () => {
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

  it("leaves the library in the application's chunk under a dev server", () => {
    expect(splitting(SERVING).groups.map((group) => group.name)).toStrictEqual([
      "framework",
      "vendor",
      "app",
    ]);
    expect(landing("/r/components/controls/src/index.ts", SERVING)).toBe("app");
    expect(landing("/r/node_modules/.pnpm/react@19/node_modules/react/index.js", SERVING)).toBe(
      "framework",
    );
  });

  it("takes only what the entry reaches statically", () => {
    for (const group of splitting().groups) {
      expect(group.tags).toStrictEqual(["$initial"]);
    }
  });

  it("groups nothing per entry and places a module by its own path alone", () => {
    for (const group of splitting().groups) {
      expect(group.entriesAware).toBeUndefined();
    }

    expect(splitting().includeDependenciesRecursively).toBe(false);
  });

  it("keeps whatever else the build output already held", () => {
    const refined = chunks().refine(BUILDING, {
      build: { rolldownOptions: { output: { format: "es" }, treeshake: true }, sourcemap: true },
    });

    expect(refined.build).toMatchObject({
      rolldownOptions: { output: { format: "es" }, treeshake: true },
      sourcemap: true,
    });
  });

  it("names the layer so a repository can remove it and says why", () => {
    expect(chunks().name).toBe("build.chunks");
    expect(chunks().because).not.toBe("");
  });
});
