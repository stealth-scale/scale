/**
 * Drives the package-level call against both tiers a rendering package is built on.
 */

import { type ConfigEnv, type UserConfig } from "vite";
import { describe, expect, it } from "vitest";

import { defineConfig as application } from "@stealthscale/vite-config/preset/app";
import { defineConfig as library } from "@stealthscale/vite-config/preset/web";

import { layers } from "#layers.ts";

const AT = new URL("..", import.meta.url).pathname;

const BUILDING: ConfigEnv = { command: "build", mode: "production" };

describe("layers", () => {
  it("names every layer for the call a consumer wrote under this package's own name", () => {
    expect(layers().map((one) => one.name)).toStrictEqual([
      "react.plugin.refresh",
      "react.plugin.icons",
      "react.plugin.compiler",
      "react.plugin.compiler(pack)",
      "react.test.cleanup",
      "react.test.document",
    ]);
  });

  it("adds the MDX compiler in the build and in the packer when asked", () => {
    expect(layers({ mdx: true }).map((one) => one.name)).toStrictEqual([
      "react.plugin.refresh",
      "react.plugin.icons",
      "react.plugin.compiler",
      "react.plugin.compiler(pack)",
      "react.test.cleanup",
      "react.test.document",
      "react.plugin.mdx",
      "react.plugin.mdx(pack)",
    ]);
  });

  it("drops the compiler for a package that asks to memoise by hand", () => {
    expect(
      layers({ compiler: false })
        .map((one) => one.name)
        .join(),
    ).not.toContain("compiler");
  });

  it("keeps the compiler for a package that names the React to write against", () => {
    expect(
      layers({ compiler: { target: "18" } })
        .map((one) => one.name)
        .join(),
    ).toContain("compiler");
  });

  it("keeps the compiler for a package that compiles under a build alone", () => {
    expect(
      layers({ compiler: "build" })
        .map((one) => one.name)
        .join(),
    ).toContain("compiler");
  });

  it("leaves MDX out unless asked", () => {
    expect(layers({}).map((one) => one.name)).toStrictEqual(layers().map((one) => one.name));
    expect(
      layers({ mdx: false })
        .map((one) => one.name)
        .join(),
    ).not.toContain("mdx");
  });

  it("declares no rules of its own", () => {
    expect(
      layers()
        .map((one) => one.name)
        .join(),
    ).not.toContain("lint");
  });

  it("composes beside the application tier", async () => {
    const defined = application(AT, { extends: [layers()] }) as (
      env: ConfigEnv,
    ) => Promise<UserConfig>;
    const held = await defined(BUILDING);

    expect(held.plugins).toBeDefined();
    expect(held.build?.manifest).toBe(true);
    expect(held.pack).toBeUndefined();
  });

  it("composes beside the library tier", async () => {
    const defined = library(AT, { extends: [layers()] }) as (env: ConfigEnv) => Promise<UserConfig>;
    const held = await defined(BUILDING);

    expect(held.plugins).toBeDefined();
    expect(held.pack).toBeDefined();
    expect(held.build?.manifest).toBeUndefined();
  });

  it("gives the tests a document beside either tier", async () => {
    const defined = library(AT, { extends: [layers()] }) as (env: ConfigEnv) => Promise<UserConfig>;

    expect((await defined(BUILDING)).test?.environment).toBe("happy-dom");
  });
});
