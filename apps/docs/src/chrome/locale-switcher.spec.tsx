import { describe, expect, it } from "vitest";

import { pressed } from "@stealthscale/testing-react";

import { chosen, shelled } from "#chrome/chrome.fixtures.tsx";
import { LocaleSwitcher } from "#chrome/locale-switcher.tsx";

/**
 * The locales the cases offer: English, Dutch, and Arabic for a language that runs right to left.
 */
const LOCALES: readonly [string, ...string[]] = ["en", "nl", "ar"];

describe("LocaleSwitcher", () => {
  it("draws nothing where the shell offers one language", async () => {
    const result = await shelled(<LocaleSwitcher />);

    expect(result.queryByRole("button")).toBeNull();
  });

  it("names the language in force in itself after what it switches", async () => {
    const result = await shelled(<LocaleSwitcher />, LOCALES);

    expect(result.getByRole("button", { name: "Language English" })).toBeDefined();
  });

  it("marks the control with the language in capitals", async () => {
    const result = await shelled(<LocaleSwitcher />, LOCALES);

    expect(result.getByRole("button", { name: "Language English" }).textContent).toContain("EN");
  });

  it("lists every language the shell offers, each in itself, once opened", async () => {
    const result = await shelled(<LocaleSwitcher />, LOCALES);

    await pressed(result.getByRole("button", { name: "Language English" }));

    expect(result.getAllByRole("menuitemradio").map((row) => row.textContent)).toStrictEqual([
      "ENEnglish✓",
      "NLNederlands✓",
      "ARالعربية✓",
    ]);
  });

  it("reads in the language picked and turns the page for one that runs right to left", async () => {
    const result = await shelled(<LocaleSwitcher />, LOCALES);

    await chosen(result, "Language English", "Nederlands");

    expect(result.getByRole("button", { name: "Language Nederlands" })).toBeDefined();
    expect(document.documentElement.dir).toBe("ltr");

    await chosen(result, "Language Nederlands", "العربية");

    expect(document.documentElement.dir).toBe("rtl");
  });
});
