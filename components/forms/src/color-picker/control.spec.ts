import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { opened, picker } from "#color-picker/color-picker.fixtures.tsx";

describe("Control", () => {
  it("renders a div around the hex input", async () => {
    const { container } = await drawn(picker());

    expect(
      slotElement(container, "color-picker", "control").contains(screen.getByRole("textbox")),
    ).toBe(true);
  });

  it("sets data-state to open while the panel is open", async () => {
    const { container } = await drawn(picker());

    await opened();

    expect(slotElement(container, "color-picker", "control").dataset["state"]).toBe("open");
  });

  it("makes the hex input inside it the picker's field", async () => {
    await drawn(picker({ id: "brand" }));

    expect(screen.getByRole("textbox").id).toBe("color-picker:brand:field");
  });
});
