import { describe, expect, it } from "vitest";

import { variantClass } from "@stealthscale/testing-theme";

import { opened } from "#app.fixtures.tsx";

describe("SectionLink", () => {
  it("leads to the index", async () => {
    const result = await opened("/components/actions/button");

    expect(result.getByRole("link", { name: "Components" }).getAttribute("href")).toBe(
      "/components",
    );
  });

  it("says it is the current page on the index", async () => {
    const result = await opened("/components");

    expect(result.getByRole("link", { name: "Components" }).getAttribute("aria-current")).toBe(
      "page",
    );
  });

  it("says it is the current page on a page under the index", async () => {
    const result = await opened("/components/actions/button");

    expect(result.getByRole("link", { name: "Components" }).getAttribute("aria-current")).toBe(
      "page",
    );
  });

  it("draws an anchor in the ghost look", async () => {
    const result = await opened("/components/actions/button");
    const link = result.getByRole("link", { name: "Components" });

    expect(link.tagName).toBe("A");
    expect(link.classList).toContain(variantClass("button", "variant", "ghost"));
  });
});
