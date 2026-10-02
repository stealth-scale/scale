import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#radio-card/radio-card.fixtures.tsx";

describe("ItemDescription", () => {
  it("renders a span inside the card", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "radio-card", "itemDescription").tagName).toBe("SPAN");
  });

  it("describes the card's input", async () => {
    await drawn(composed());

    expect(
      screen.getByRole("radio", { name: "Standard" }).getAttribute("aria-describedby"),
    ).toContain(screen.getByText("Three to five days.").id);
  });

  it("sets data-state to checked on the description of the checked card", async () => {
    await drawn(composed({ defaultValue: "Standard" }));

    expect(screen.getByText("Three to five days.").dataset["state"]).toBe("checked");
  });

  it("sets data-disabled on the description of a disabled card", async () => {
    await drawn(composed({}, { closed: "Standard" }));

    expect(screen.getByText("Three to five days.").dataset["disabled"]).toBe("true");
  });
});
