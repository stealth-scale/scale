import { describe, expect, it } from "vitest";

import { pressed } from "@stealthscale/testing-react";

import { shelled } from "#chrome/chrome.fixtures.tsx";
import { ColorModeToggle } from "#chrome/color-mode-toggle.tsx";

describe("ColorModeToggle", () => {
  it("names itself for a reader who cannot see the glyph", async () => {
    const result = await shelled(<ColorModeToggle />);

    expect(result.getByRole("button", { name: "Dark mode" })).toBeDefined();
  });

  it("starts off while the page is drawn light", async () => {
    const result = await shelled(<ColorModeToggle />);

    expect(result.getByRole("button", { name: "Dark mode" }).getAttribute("aria-pressed")).toBe(
      "false",
    );
  });

  it("turns the page dark under a press", async () => {
    const result = await shelled(<ColorModeToggle />);

    await pressed(result.getByRole("button", { name: "Dark mode" }));

    expect(result.getByRole("button", { name: "Dark mode" }).getAttribute("aria-pressed")).toBe(
      "true",
    );
  });

  it("turns the page light again under a second press", async () => {
    const result = await shelled(<ColorModeToggle />);

    await pressed(result.getByRole("button", { name: "Dark mode" }));
    await pressed(result.getByRole("button", { name: "Dark mode" }));

    expect(result.getByRole("button", { name: "Dark mode" }).getAttribute("aria-pressed")).toBe(
      "false",
    );
  });
});
