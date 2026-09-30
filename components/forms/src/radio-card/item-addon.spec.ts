import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#radio-card/radio-card.fixtures.tsx";

describe("ItemAddon", () => {
  it("renders a span inside the card", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "radio-card", "itemAddon").tagName).toBe("SPAN");
  });

  it("describes the card's input after the description", async () => {
    await drawn(composed());

    expect(
      screen.getByRole("radio", { name: "Same day" }).getAttribute("aria-describedby")?.split(" "),
    ).toStrictEqual([screen.getByText("Leaves before six.").id, screen.getByText("£12.00").id]);
  });

  it("sets data-state to unchecked on the addon of a card that is not checked", async () => {
    await drawn(composed({ defaultValue: "Standard" }));

    expect(screen.getByText("£12.00").dataset["state"]).toBe("unchecked");
  });
});
