import { describe, expect, it } from "vitest";

import * as build from "#build/index.ts";

describe("vite-config", () => {
  it("exports base and web under preset", () => {
    expect(Object.keys(build.preset).toSorted()).toStrictEqual(["base", "web"]);
  });

  it("exports every build layer by name", () => {
    for (const verb of [
      "base",
      "chunks",
      "inventory",
      "licences",
      "manifest",
      "preload",
      "sourcemaps",
    ]) {
      expect(Object.keys(build), `${verb} is not published`).toContain(verb);
    }
  });

  it("exports nothing beyond the build layers and preset", () => {
    expect(Object.keys(build).toSorted()).toStrictEqual([
      "base",
      "chunks",
      "inventory",
      "licences",
      "manifest",
      "preload",
      "preset",
      "sourcemaps",
    ]);
  });
});
