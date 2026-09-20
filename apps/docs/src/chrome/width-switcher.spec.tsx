import { describe, expect, it } from "vitest";

import { pressed } from "@stealthscale/testing-react";

import { chosen, shelled } from "#chrome/chrome.fixtures.tsx";
import { WidthSwitcher } from "#chrome/width-switcher.tsx";

/**
 * Reads the device the control's glyph stands for.
 */
function deviceOf(control: HTMLElement): string | undefined {
  return control.querySelector<SVGElement>("[data-device]")?.dataset["device"];
}

describe("WidthSwitcher", () => {
  it("names the window as the width in force until one is picked", async () => {
    const result = await shelled(<WidthSwitcher />);

    expect(result.getByRole("button", { name: "Width Window" })).toBeDefined();
  });

  it("marks the window as a monitor", async () => {
    const result = await shelled(<WidthSwitcher />);

    expect(deviceOf(result.getByRole("button", { name: "Width Window" }))).toBe("monitor");
  });

  it("lists the window, a phone and every breakpoint once opened", async () => {
    const result = await shelled(<WidthSwitcher />);

    await pressed(result.getByRole("button", { name: "Width Window" }));

    expect(result.getAllByRole("menuitemradio").map((row) => row.textContent)).toStrictEqual([
      "Window✓",
      "Phone✓",
      "sm 640✓",
      "md 768✓",
      "lg 1024✓",
      "xl 1280✓",
      "2xl 1536✓",
    ]);
  });

  it("names the width picked and marks it with its device", async () => {
    const result = await shelled(<WidthSwitcher />);

    await chosen(result, "Width Window", "md 768");

    expect(deviceOf(result.getByRole("button", { name: "Width md 768" }))).toBe("tablet");
  });

  it("goes back to the window", async () => {
    const result = await shelled(<WidthSwitcher />);

    await chosen(result, "Width Window", "Phone");
    await chosen(result, "Width Phone", "Window");

    expect(result.getByRole("button", { name: "Width Window" })).toBeDefined();
  });
});
