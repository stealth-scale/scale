import { describe, expect, it } from "vitest";

import { opened } from "#app.fixtures.tsx";

describe("Bar", () => {
  it("leads the brand to the index", async () => {
    const result = await opened("/components/actions/button");

    expect(result.getByRole("link", { name: "Stealth" }).getAttribute("href")).toBe("/components");
  });

  it("offers the control that opens the navigation", async () => {
    const result = await opened("/components/actions/button");

    expect(result.getByRole("button", { name: "Navigation" })).toBeDefined();
  });

  it("names the theme in force", async () => {
    const result = await opened("/components/actions/button");

    expect(result.getByRole("button", { name: "Theme graphite" })).toBeDefined();
  });

  it("names the colour mode in force", async () => {
    const result = await opened("/components/actions/button");

    expect(result.getByRole("button", { name: "Colour mode System" })).toBeDefined();
  });
});
