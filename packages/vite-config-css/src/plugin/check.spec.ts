/**
 * Covers the contribution the check returns.
 */

import { describe, expect, it } from "vitest";

import { check } from "#plugin/check.ts";

describe("check", () => {
  it("returns a contribution at plugins", () => {
    expect(check().at).toBe("plugins");
  });

  it("returns a contribution named css.check", () => {
    expect(check().name).toBe("css.check");
  });

  it("records a reason naming the type checker", () => {
    expect(check().because).toContain("type checker");
  });

  it("returns a contribution whose item is defined", () => {
    expect(check().item).toBeDefined();
  });

  it("returns a contribution whose item is defined when also is stated", () => {
    expect(() => check({ also: ["**/*.module.css"] })).not.toThrow();
    expect(check({ also: ["**/*.module.css"] }).item).toBeDefined();
  });

  it("returns a contribution whose item is defined when except is stated", () => {
    expect(check({ except: ["vendor/**"] }).item).toBeDefined();
  });
});
