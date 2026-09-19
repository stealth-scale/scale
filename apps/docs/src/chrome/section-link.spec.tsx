import { type RenderResult, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { variantClass } from "@stealthscale/testing-theme";

import { opened } from "#app.fixtures.tsx";

/**
 * Finds the link in the bar, apart from the page's trail of the same name.
 */
function linked(result: RenderResult): HTMLElement {
  return within(result.getByRole("toolbar")).getByRole("link", { name: "Components" });
}

describe("SectionLink", () => {
  it("leads to the index", async () => {
    const result = await opened("/components/actions/button");

    expect(linked(result).getAttribute("href")).toBe("/components");
  });

  it("says it is the current page on the index", async () => {
    const result = await opened("/components");

    expect(linked(result).getAttribute("aria-current")).toBe("page");
  });

  it("says it is the current page on a page under the index", async () => {
    const result = await opened("/components/actions/button");

    expect(linked(result).getAttribute("aria-current")).toBe("page");
  });

  it("draws an anchor in the ghost look on the neutral palette", async () => {
    const result = await opened("/components/actions/button");
    const link = linked(result);

    expect(link.tagName).toBe("A");
    expect(link.classList).toContain(variantClass("button", "variant", "ghost"));
    expect(link.classList).toContain(variantClass("button", "status", "neutral"));
  });
});
