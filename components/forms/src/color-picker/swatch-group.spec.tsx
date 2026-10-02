import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { picker } from "#color-picker/color-picker.fixtures.tsx";
import { SwatchGroup } from "#color-picker/swatch-group.tsx";

describe("SwatchGroup", () => {
  it("renders a group named by its aria-label", async () => {
    await drawn(picker({ defaultOpen: true }));

    expect(screen.getByRole("group", { name: "Presets" }).tagName).toBe("DIV");
  });

  it("is named by the picker's label without an aria-label", async () => {
    await drawn(picker({ defaultOpen: true }, { panel: <SwatchGroup /> }));

    expect(screen.getByRole("group", { name: "Brand color" })).toBeDefined();
  });

  it("points no aria-labelledby at the label beside an aria-label", async () => {
    await drawn(picker({ defaultOpen: true }));

    expect(screen.getByRole("group", { name: "Presets" }).hasAttribute("aria-labelledby")).toBe(
      false,
    );
  });

  it("stays unnamed without an aria-label or a label", async () => {
    const { container } = await drawn(
      picker({ defaultOpen: true }, { labelled: false, panel: <SwatchGroup /> }),
    );

    expect(
      container.querySelector(".color-picker__swatch-group")?.hasAttribute("aria-labelledby"),
    ).toBe(false);
  });
});
