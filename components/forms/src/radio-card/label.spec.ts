import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#radio-card/radio-card.fixtures.tsx";

describe("Label", () => {
  it("renders a span inside the root", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "radio-card", "label").tagName).toBe("SPAN");
  });

  it("labels the set through aria-labelledby", async () => {
    const { container } = await drawn(composed());

    expect(screen.getByRole("radiogroup").getAttribute("aria-labelledby")).toBe(
      slotElement(container, "radio-card", "label").id,
    );
  });

  it("leaves the set without aria-labelledby when it is absent", async () => {
    await drawn(composed({ "aria-label": "Delivery speed" }, { labelled: false }));

    expect(screen.getByRole("radiogroup").getAttribute("aria-labelledby")).toBeNull();
  });
});
