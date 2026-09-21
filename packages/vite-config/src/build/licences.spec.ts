import { type UserConfig } from "vite";
import { describe, expect, it } from "vitest";

import { licences } from "#build/licences.ts";

describe("licences", () => {
  it("sets build.license to true", () => {
    expect((licences().config as UserConfig).build?.license).toBe(true);
  });

  it("names the preset build.licences", () => {
    expect(licences().name).toBe("build.licences");
  });
});
