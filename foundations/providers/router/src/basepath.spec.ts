import { describe, expect, it } from "vitest";

import { basepathOf } from "#basepath.ts";

describe("basepathOf", () => {
  it("mounts at the root when the application is served there", () => {
    expect(basepathOf("/")).toBe("/");
    expect(basepathOf("")).toBe("/");
  });

  it("takes the path of a path-only base without its trailing slash", () => {
    expect(basepathOf("/design/")).toBe("/design");
    expect(basepathOf("/one/two/")).toBe("/one/two");
    expect(basepathOf("/design")).toBe("/design");
  });

  it("mounts at the root when the assets live on another host and nothing says where the documents are", () => {
    expect(basepathOf("https://cdn.example.test/assets/")).toBe("/");
  });

  it("takes the documents' path over the base whatever the base says", () => {
    expect(basepathOf("https://cdn.example.test/assets/", "/design/")).toBe("/design");
    expect(basepathOf("/assets/", "/")).toBe("/");
  });
});
