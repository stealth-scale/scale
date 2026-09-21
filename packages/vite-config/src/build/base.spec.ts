import { type UserConfig } from "vite";
import { describe, expect, it } from "vitest";

import { base } from "#build/base.ts";

describe("base", () => {
  it("sets base to the origin it was given", () => {
    expect((base("https://cdn.example.com/remote/").config as UserConfig).base).toBe(
      "https://cdn.example.com/remote/",
    );
  });

  it("sets base to the path it was given", () => {
    expect((base("/remote/").config as UserConfig).base).toBe("/remote/");
  });

  it("names the preset build.base with the path", () => {
    expect(base("/remote/").name).toBe("build.base(/remote/)");
  });
});
