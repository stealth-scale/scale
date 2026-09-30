import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { OCTOBER_14, picked } from "#date-picker/date-picker.fixtures.tsx";

describe("Control", () => {
  it("renders a div around the input", async () => {
    const { container } = await drawn(picked());

    expect(
      slotElement(container, "date-picker", "control").contains(screen.getByRole("textbox")),
    ).toBe(true);
  });

  it("renders the ID the panel's layer finds it by", async () => {
    const { container } = await drawn(picked({ id: "trip" }));

    expect(slotElement(container, "date-picker", "control").id).toBe("datepicker:trip:control");
  });

  it("sets data-placeholder-shown while no date is set", async () => {
    const { container } = await drawn(picked());

    expect(slotElement(container, "date-picker", "control").dataset["placeholderShown"]).toBe("");
  });

  it("drops data-placeholder-shown while a date is set", async () => {
    const { container } = await drawn(picked({ defaultValue: [OCTOBER_14] }));

    expect(
      slotElement(container, "date-picker", "control").dataset["placeholderShown"],
    ).toBeUndefined();
  });

  it("sets data-invalid in an invalid picker", async () => {
    const { container } = await drawn(picked({ invalid: true }));

    expect(slotElement(container, "date-picker", "control").dataset["invalid"]).toBe("");
  });
});
