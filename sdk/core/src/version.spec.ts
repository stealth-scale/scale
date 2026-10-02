import { describe, expect, it } from "vitest";

import { below, compatible, isCaretRange, isVersion, needs } from "#version.ts";

describe("version", () => {
  it.each([
    { range: "^1.4.0", version: "1.9.2" },
    { range: "^1.4", version: "1.4.0" },
    { range: "^1", version: "1.0.0+build.7" },
    { range: "^0.4.0", version: "0.4.7" },
    { range: "^0.0.3", version: "0.0.3" },
    { range: "^0", version: "0.9.1" },
    { range: "^0.0", version: "0.0.9" },
  ])("finds $version compatible with $range", ({ range, version }) => {
    expect(compatible(range, version)).toBe(true);
  });

  it.each([
    { range: "^1.4.0", version: "2.0.0" },
    { range: "^1.4.0", version: "1.3.9" },
    { range: "^0.4.0", version: "0.5.0" },
    { range: "^0.0.3", version: "0.0.4" },
    { range: "^0", version: "1.0.0" },
    { range: "^0.0", version: "0.1.0" },
    { range: "^1.0.0", version: "1.0.0-beta.1" },
  ])("finds $version incompatible with $range", ({ range, version }) => {
    expect(compatible(range, version)).toBe(false);
  });

  it.each([
    { range: "^1.4.0", version: "1.3.9" },
    { range: "^1.0.0", version: "1.0.0-beta" },
    { range: "^1", version: "0.9.9" },
  ])("finds $version below $range", ({ range, version }) => {
    expect(below(range, version)).toBe(true);
  });

  it.each([
    { range: "^1.4.0", version: "1.4.0" },
    { range: "^1.4.0", version: "2.0.0" },
    { range: "^1.4.0", version: "1.4.0+build.1" },
  ])("finds $version not below $range", ({ range, version }) => {
    expect(below(range, version)).toBe(false);
  });

  it("throws for a range that is not a caret range", () => {
    expect(() => compatible("~1.4.0", "1.4.0")).toThrow(
      'compatible() takes a caret range and a version, and received "~1.4.0" and "1.4.0".',
    );
  });

  it("throws for a version that is not a version", () => {
    expect(() => below("^1.4.0", "1.4")).toThrow(
      'below() takes a caret range and a version, and received "^1.4.0" and "1.4".',
    );
  });

  it.each(["1.4.0", "0.0.0", "1.4.0-beta.1", "1.4.0+build.7", "10.20.30-rc.1+sha.5"])(
    "returns true for the version %s",
    (text) => {
      expect(isVersion(text)).toBe(true);
    },
  );

  it.each(["1.4", "v1.4.0", "1.4.0.1", "^1.4.0", "", "one"])(
    "returns false for the version %s",
    (text) => {
      expect(isVersion(text)).toBe(false);
    },
  );

  it.each(["^1", "^1.4", "^1.4.0", "^0.0.3"])("returns true for the caret range %s", (text) => {
    expect(isCaretRange(text)).toBe(true);
  });

  it.each(["1.4.0", "~1.4.0", "^1.4.0-beta", "^1.x", ">=1.4.0", "^"])(
    "returns false for the caret range %s",
    (text) => {
      expect(isCaretRange(text)).toBe(false);
    },
  );

  it("states the needed plugin with its range and version", () => {
    expect(needs({ pluginId: "identity", version: "0.4.2" }, "^0.4.0")).toStrictEqual({
      pluginId: "identity",
      range: "^0.4.0",
      version: "0.4.2",
    });
  });

  it("leaves the version out where the contract states none", () => {
    expect(needs({ pluginId: "identity" }, "^0.4.0")).toStrictEqual({
      pluginId: "identity",
      range: "^0.4.0",
    });
  });

  it("marks an optional requirement", () => {
    expect(needs({ pluginId: "identity" }, "^0.4.0", { optional: true }).optional).toBe(true);
  });
});
