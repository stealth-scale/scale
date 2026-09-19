import { describe, expect, it } from "vitest";

import { opened } from "#app.fixtures.tsx";

describe("Frame", () => {
  it("draws the rail beside the page", async () => {
    const result = await opened("/components/actions/button");

    expect(result.getByRole("navigation", { name: "Pages" })).toBeDefined();
  });

  it("draws the page in the main landmark", async () => {
    const result = await opened("/components/actions/button");

    expect(result.getByRole("main").contains(result.getByRole("heading", { level: 1 }))).toBe(true);
  });

  it("offers a keyboard the way past the bar and the rail", async () => {
    const result = await opened("/components/actions/button");

    expect(result.getByRole("link", { name: "Skip to content" }).getAttribute("href")).toBe(
      "#content",
    );
  });

  it("lands the skip link on the main landmark", async () => {
    const result = await opened("/components/actions/button");

    expect(result.getByRole("main").id).toBe("content");
  });
});
