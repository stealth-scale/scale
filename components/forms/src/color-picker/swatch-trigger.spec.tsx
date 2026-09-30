import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed, settled } from "@stealthscale/testing-react";

import { hiddenOf, opened, picker } from "#color-picker/color-picker.fixtures.tsx";
import { SwatchTrigger } from "#color-picker/swatch-trigger.tsx";

describe("SwatchTrigger", () => {
  it("renders a button named by its label", async () => {
    await drawn(picker());
    await opened();

    expect(screen.getByRole("button", { name: "Blue" }).tagName).toBe("BUTTON");
  });

  it("is named by its color in hex without a label", async () => {
    await drawn(picker({}, { panel: <SwatchTrigger value="#0D9488" /> }));
    await opened();

    expect(screen.getByRole("button", { name: "#0D9488" })).toBeDefined();
  });

  it("is named by eight hex digits for a translucent color", async () => {
    await drawn(picker({}, { panel: <SwatchTrigger value="rgba(13, 148, 136, 0.5)" /> }));
    await opened();

    expect(screen.getByRole("button", { name: "#0D948880" })).toBeDefined();
  });

  it("reports aria-pressed while its color is the picker's", async () => {
    await drawn(picker());
    await opened();

    expect(screen.getByRole("button", { name: "Blue" }).getAttribute("aria-pressed")).toBe("true");
  });

  it("reports aria-pressed false while its color is another", async () => {
    await drawn(picker());
    await opened();

    expect(screen.getByRole("button", { name: "Red" }).getAttribute("aria-pressed")).toBe("false");
  });

  it("sets the picker's color on a press", async () => {
    const { container } = await drawn(picker());

    await opened();
    await pressed(screen.getByRole("button", { name: "Red" }));
    await settled();

    expect(hiddenOf(container).value).toBe("rgba(220, 38, 38, 1)");
  });

  it("disables itself when disabled", async () => {
    await drawn(picker({}, { panel: <SwatchTrigger disabled label="Teal" value="#0D9488" /> }));
    await opened();

    expect(screen.getByRole("button", { name: "Teal" }).hasAttribute("disabled")).toBe(true);
  });

  it("closes the panel on a press with closeOnSelect", async () => {
    await drawn(picker({ closeOnSelect: true }));
    await opened();
    await pressed(screen.getByRole("button", { name: "Red" }));
    await settled();

    expect(screen.queryByRole("dialog", { hidden: true })).toBeNull();
  });
});
