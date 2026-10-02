import { describe, expect, it } from "vitest";

import * as published from "#index.ts";

const SURFACE = [
  "build",
  "configuring",
  "contribute",
  "define",
  "defineConfig",
  "deps",
  "federation",
  "fmt",
  "lint",
  "located",
  "named",
  "override",
  "owned",
  "pack",
  "preset",
  "preview",
  "remove",
  "resolvingMetadata",
  "resolve",
  "run",
  "server",
  "serving",
  "ssr",
  "staged",
  "test",
  "worker",
];

const WITHHELD = ["appended", "flattened", "isLayer", "resolved", "surviving"];

describe("vite-config", () => {
  it("exports every name the surface lists", () => {
    for (const name of SURFACE) {
      expect(Object.keys(published), `${name} is not published`).toContain(name);
    }
  });

  it("exports none of the names withheld from the surface", () => {
    for (const name of WITHHELD) {
      expect(Object.keys(published), `${name} is published`).not.toContain(name);
    }
  });

  it("exports nothing beyond the surface", () => {
    expect(Object.keys(published).toSorted()).toStrictEqual(SURFACE.toSorted());
  });
});
