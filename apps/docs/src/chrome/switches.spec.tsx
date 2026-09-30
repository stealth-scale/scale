import { describe, expect, it } from "vitest";

import { chosen, narrowed, shelled } from "#chrome/chrome.fixtures.tsx";
import { Switches } from "#chrome/switches.tsx";
import { THEMES } from "#themes.ts";

describe("Switches", () => {
  it("renders four switches from the language to the mode", async () => {
    const result = await shelled(<Switches />, ["en", "nl"]);

    expect(result.getAllByRole("button").map((control) => control.textContent)).toStrictEqual([
      "LanguageENEnglish",
      "WidthWindow",
      `Theme${THEMES[0] ?? ""}`,
      "",
    ]);
  });

  it("renders no width switcher on a narrow window", async () => {
    narrowed();
    const result = await shelled(<Switches />);

    expect(result.queryByRole("button", { name: /^Width/u })).toBeNull();
  });

  it("renders the width switcher while a phone width is picked", async () => {
    const result = await shelled(<Switches />);

    await chosen(result, "Width Window", "Phone");

    expect(result.getByRole("button", { name: "Width Phone" })).toBeDefined();
  });
});
