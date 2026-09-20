import { describe, expect, it } from "vitest";

import { shelled } from "#chrome/chrome.fixtures.tsx";
import { Switches } from "#chrome/switches.tsx";
import { THEMES } from "#themes.ts";

describe("Switches", () => {
  it("draws the language, the width, the theme and the mode in that order", async () => {
    const result = await shelled(<Switches />, ["en", "nl"]);

    expect(result.getAllByRole("button").map((control) => control.textContent)).toStrictEqual([
      "LanguageENEnglish",
      "WidthWindow",
      `Theme${THEMES[0] ?? ""}`,
      "",
    ]);
  });
});
