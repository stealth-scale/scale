import { describe, expect, it } from "vitest";

import { type Layer } from "@stealthscale/vite-config-core";

import { workspace } from "#workspace.ts";

function fieldOf(layer: Layer | undefined, field: "at" | "item"): unknown {
  return layer !== undefined && field in layer ? Reflect.get(layer, field) : undefined;
}

describe("workspace", () => {
  it("returns eight layers for the workspace root", () => {
    expect(workspace()).toHaveLength(8);
  });

  it("prefixes every layer name with specimen.", () => {
    expect(workspace().every((layer) => layer.name.startsWith("specimen."))).toBe(true);
  });

  it("returns the specimen layers before the example layers", () => {
    expect(workspace().map((layer) => layer.name)).toStrictEqual([
      "specimen.uncounted(**/*.specimen.tsx)",
      "specimen.exported",
      "specimen.undocumented",
      "specimen.described",
      "specimen.composed",
      "specimen.example.uncounted(**/*.example.tsx)",
      "specimen.example.undocumented",
      "specimen.example.composed",
    ]);
  });

  it("adds the specimen glob to the coverage exclusions first", () => {
    expect(fieldOf(workspace()[0], "at")).toBe("test.coverage.exclude");
  });

  it("gives every layer a non-empty reason", () => {
    expect(workspace().every((layer) => "because" in layer && layer.because !== "")).toBe(true);
  });

  it("defaults the specimen glob to every specimen file", () => {
    expect(fieldOf(workspace()[0], "item")).toBe("**/*.specimen.tsx");
  });

  it("uses the specimen globs passed as files", () => {
    expect(fieldOf(workspace(["components/**/*.specimen.tsx"])[0], "item")).toBe(
      "components/**/*.specimen.tsx",
    );
  });
});
