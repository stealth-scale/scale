import { describe, expect, it } from "vitest";

import { chosen, shelled } from "#chrome/chrome.fixtures.tsx";
import { ThemeSwitcher } from "#chrome/theme-switcher.tsx";

describe("ThemeSwitcher", () => {
  it("names the theme in force after what it switches", async () => {
    const result = await shelled(<ThemeSwitcher />);

    expect(result.getByRole("button", { name: "Theme graphite" })).toBeDefined();
  });

  it("lists every theme the shell offers once opened", async () => {
    const result = await shelled(<ThemeSwitcher />);

    await chosen(result, "Theme graphite", "steel");

    expect(result.getByRole("button", { name: "Theme steel" })).toBeDefined();
  });
});
