import { type UserConfig } from "vite";
import { describe, expect, it } from "vitest";

import { published } from "#pack/published.ts";
import { answered, told } from "#vite.fixtures.ts";

function entry(exports: Readonly<Record<string, unknown>>): Record<string, string> {
  const held = answered(published(), { manifest: { exports, name: "held" } }) as UserConfig;

  return (held.pack as { entry: Record<string, string> }).entry;
}

function resolving(manifest: Parameters<typeof told>[0]): () => unknown {
  const held = published().config;

  return () => (typeof held === "function" ? held(told(manifest)) : held);
}

describe("published", () => {
  it("builds an entry for every subpath naming a source file", () => {
    const held = entry({
      ".": { default: "./dist/index.mjs", "stealth-source": "./src/index.ts" },
      "./preset/web": { default: "./dist/preset/web.mjs", "stealth-source": "./src/preset/web.ts" },
    });

    expect(held).toStrictEqual({ index: "src/index.ts", "preset/web": "src/preset/web.ts" });
  });

  it("keys each entry by the subpath a consumer imports", () => {
    expect(entry({ "./web": { "stealth-source": "./src/preset/browser.ts" } })).toStrictEqual({
      web: "src/preset/browser.ts",
    });
  });

  it("accepts a source path written without the leading ./", () => {
    expect(entry({ ".": { "stealth-source": "src/index.ts" } })).toStrictEqual({
      index: "src/index.ts",
    });
  });

  it("skips a subpath pointing at a shipped file", () => {
    const held = entry({ ".": { "stealth-source": "./src/index.ts" }, "./globals": "./g.d.ts" });

    expect(held).toStrictEqual({ index: "src/index.ts" });
  });

  it("skips a subpath whose value is null", () => {
    const held = entry({ ".": { "stealth-source": "./src/index.ts" }, "./nothing": null });

    expect(held).toStrictEqual({ index: "src/index.ts" });
  });

  it("names the preset pack.published", () => {
    expect(published().name).toBe("pack.published");
  });

  it("throws for a manifest declaring no exports", () => {
    expect(resolving({ manifest: { name: "held" } })).toThrow(/found no exports/u);
  });

  it("throws when no subpath names a source file", () => {
    expect(resolving({ manifest: { exports: { "./thing": "./thing.json" } } })).toThrow(
      /found nothing to build/u,
    );
  });

  it("returns an empty configuration for a workspace root", () => {
    const held = resolving({
      at: "/repository",
      manifest: { workspaces: ["packages/*"] },
      root: "/repository",
    });

    expect(held()).toStrictEqual({});
  });

  it("returns an empty configuration for a root that declares an export map", () => {
    const held = resolving({
      at: "/repository",
      manifest: { exports: {}, workspaces: [] },
      root: "/repository",
    });

    expect(held()).toStrictEqual({});
  });

  it("builds every entry for a package standing alone in a repository", () => {
    const held = resolving({
      at: "/alone",
      manifest: {
        exports: {
          ".": { default: "./dist/index.mjs", "stealth-source": "./src/index.ts" },
          "./extra": { default: "./dist/extra.mjs", "stealth-source": "./src/extra.ts" },
        },
        name: "alone",
      },
      root: "/alone",
    });

    expect(held()).toStrictEqual({
      pack: { entry: { extra: "src/extra.ts", index: "src/index.ts" } },
    });
  });

  it("throws for a package standing alone that declares no export map", () => {
    expect(resolving({ at: "/alone", manifest: { name: "alone" }, root: "/alone" })).toThrow(
      /found no exports/u,
    );
  });
});
