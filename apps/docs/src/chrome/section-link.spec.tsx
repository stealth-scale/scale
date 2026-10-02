import { type RenderResult, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { variantClass } from "@stealthscale/testing-theme";

import { opened } from "#app.fixtures.tsx";

/**
 * Returns the catalogue link in the toolbar, excluding the breadcrumb link of the same name.
 */
function linked(result: RenderResult): HTMLElement {
  return within(result.getByRole("toolbar")).getByRole("link", { name: "Catalogue" });
}

describe("SectionLink", () => {
  it("links to the index", async () => {
    const result = await opened("/components/actions/button");

    expect(linked(result).getAttribute("href")).toBe("/");
  });

  it("sets aria-current to page on the index", async () => {
    const result = await opened("/");

    expect(linked(result).getAttribute("aria-current")).toBe("page");
  });

  it("sets aria-current to page on a page under the index", async () => {
    const result = await opened("/components/actions/button");

    expect(linked(result).getAttribute("aria-current")).toBe("page");
  });

  it("renders an anchor with the ghost look class", async () => {
    const result = await opened("/components/actions/button");
    const link = linked(result);

    expect(link.tagName).toBe("A");
    expect(link.classList).toContain(variantClass("button", "variant", "ghost"));
  });

  it("applies the neutral palette class", async () => {
    const result = await opened("/components/actions/button");

    expect(linked(result).classList).toContain(variantClass("button", "palette", "neutral"));
  });

  it("applies the small size class", async () => {
    const result = await opened("/components/actions/button");

    expect(linked(result).classList).toContain(variantClass("button", "size", "sm"));
  });
});
