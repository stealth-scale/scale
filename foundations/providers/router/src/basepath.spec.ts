import { describe, expect, it } from "vitest";

import { basepathOf } from "#basepath.ts";

describe("basepathOf", () => {
  it("returns the root when the base names no path", () => {
    expect(basepathOf("/")).toBe("/");
    expect(basepathOf("")).toBe("/");
  });

  it("strips the trailing slash from a path-only base", () => {
    expect(basepathOf("/design/")).toBe("/design");
    expect(basepathOf("/one/two/")).toBe("/one/two");
    expect(basepathOf("/design")).toBe("/design");
  });

  it("returns the root when the base names another host", () => {
    expect(basepathOf("https://cdn.example.test/assets/")).toBe("/");
  });

  it("returns the documents path when one is given", () => {
    expect(basepathOf("https://cdn.example.test/assets/", "/design/")).toBe("/design");
    expect(basepathOf("/assets/", "/")).toBe("/");
  });
});
