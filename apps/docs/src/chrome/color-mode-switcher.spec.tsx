import { describe, expect, it } from "vitest";

import { chosen, shelled } from "#chrome/chrome.fixtures.tsx";
import { ColorModeSwitcher } from "#chrome/color-mode-switcher.tsx";

describe("ColorModeSwitcher", () => {
  it("names the choice in force after what it switches", async () => {
    const result = await shelled(<ColorModeSwitcher />);

    expect(result.getByRole("button", { name: "Colour mode System" })).toBeDefined();
  });

  it("switches to the mode a reader chooses", async () => {
    const result = await shelled(<ColorModeSwitcher />);

    await chosen(result, "Colour mode System", "Dark");

    expect(result.getByRole("button", { name: "Colour mode Dark" })).toBeDefined();
  });
});
