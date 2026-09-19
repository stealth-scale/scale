import { describe, expect, it } from "vitest";

import { variantClass } from "@stealthscale/testing-theme";

import { opened } from "#app.fixtures.tsx";

describe("Brand", () => {
  it("leads to the index", async () => {
    const result = await opened("/components/actions/button");

    expect(result.getByRole("link", { name: "Stealth" }).getAttribute("href")).toBe("/components");
  });

  it("says it is the current page on the index", async () => {
    const result = await opened("/components");

    expect(result.getByRole("link", { name: "Stealth" }).getAttribute("aria-current")).toBe("page");
  });

  it("does not say it is the current page on a page under the index", async () => {
    const result = await opened("/components/actions/button");

    expect(result.getByRole("link", { name: "Stealth" }).getAttribute("aria-current")).toBeNull();
  });

  it("takes the bar's ink rather than the link ink", async () => {
    const result = await opened("/components/actions/button");

    expect(result.getByRole("link", { name: "Stealth" }).classList).toContain(
      variantClass("link", "inherit", true),
    );
  });
});
