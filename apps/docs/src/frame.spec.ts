import { describe, expect, it } from "vitest";

import { opened } from "#app.fixtures.tsx";

describe("Frame", () => {
  it("renders the rail's block of components beside the page", async () => {
    const result = await opened("/components/actions/button");

    expect(result.getByRole("navigation", { name: "Components" })).toBeDefined();
  });

  it("renders the search that filters the rail", async () => {
    const result = await opened("/components/actions/button");

    expect(result.getByRole("searchbox", { name: "Filter pages" })).toBeDefined();
  });

  it("renders the page in the main landmark", async () => {
    const result = await opened("/components/actions/button");

    expect(result.getByRole("main").contains(result.getByRole("heading", { level: 1 }))).toBe(true);
  });

  it("links the skip link to #content", async () => {
    const result = await opened("/components/actions/button");

    expect(result.getByRole("link", { name: "Skip to content" }).getAttribute("href")).toBe(
      "#content",
    );
  });

  it("sets the id of the main landmark to content", async () => {
    const result = await opened("/components/actions/button");

    expect(result.getByRole("main").id).toBe("content");
  });
});
