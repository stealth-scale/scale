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
  it("publishes what a config and a config package need", () => {
    for (const name of SURFACE) {
      expect(Object.keys(published), `${name} is not published`).toContain(name);
    }
  });

  it("exports none of the machinery that composes them", () => {
    for (const name of WITHHELD) {
      expect(Object.keys(published), `${name} is published`).not.toContain(name);
    }
  });

  it("publishes nothing beyond what is named here", () => {
    expect(Object.keys(published).toSorted()).toStrictEqual(SURFACE.toSorted());
  });
});
