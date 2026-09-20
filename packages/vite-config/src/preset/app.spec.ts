/**
 * Proves the application tier builds what the library tier would have packed.
 */

import { type ConfigEnv, type UserConfig } from "vite";
import { describe, expect, it } from "vitest";

import { type Layer } from "@stealthscale/vite-config-core";

import { defineConfig, layers } from "#preset/app.ts";
import { layers as web } from "#preset/web.ts";

/**
 * The package root, which is where a tier expects to find a manifest.
 */
const AT = new URL("../..", import.meta.url).pathname;

/**
 * Flattens a tier's layers one level and lists what each is called.
 */
function names(of: ReturnType<typeof layers>): string[] {
  const flat: Layer[] = of.flatMap((held) =>
    Array.isArray(held) ? (held as Layer[]) : [held as Layer],
  );

  return flat.map((held) => held.name);
}

describe("app", () => {
  it("packs nothing", () => {
    expect(names(layers()).join()).not.toContain("pack.");
  });

  it("builds rather than packing", () => {
    const held = names(layers());

    expect(held).toContain("build.manifest");
    expect(held).toContain("build.sourcemaps");
    expect(held).toContain("build.preload");
  });

  it("bundles a worker as a module", () => {
    expect(names(layers())).toContain("worker.format");
  });

  it("serves the application from one bundle", () => {
    expect(names(layers())).toContain("server.bundled");
  });

  it("applies the browser rules and the browser environment", () => {
    const held = names(layers());

    expect(held).toContain("test.environment(happy-dom)");
    expect(held.some((one) => one.startsWith("lint."))).toBe(true);
  });

  it("matches the library tier for what is deployed rather than published", () => {
    const held = new Set(names(layers()));
    const other = new Set(names(web()));
    const onlyHere = [...held].filter((one) => !other.has(one));
    const onlyThere = [...other].filter((one) => !held.has(one));

    expect(
      onlyHere.every(
        (one) => one.startsWith("build.") || one === "worker.format" || one === "server.bundled",
      ),
    ).toBe(true);
    expect(onlyThere.every((one) => one.startsWith("pack."))).toBe(true);
  });

  it("composes into a config a repository's own keys still override", async () => {
    const held = await (
      defineConfig(AT, { build: { manifest: false } }) as (env: ConfigEnv) => Promise<UserConfig>
    )({ command: "build", mode: "production" });

    expect(held.build?.manifest).toBe(false);
  });
});
