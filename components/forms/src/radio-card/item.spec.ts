import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { composed } from "#radio-card/radio-card.fixtures.tsx";

describe("Item", () => {
  it("renders a label around each card", async () => {
    const { container } = await drawn(composed());

    expect(
      [...container.querySelectorAll('[data-part="item"]')].map((item) => item.tagName),
    ).toStrictEqual(["LABEL", "LABEL", "LABEL"]);
  });

  it("lists the description and the addon in the input's aria-describedby", async () => {
    await drawn(composed());

    const ids = screen.getByRole("radio", { name: "Next day" }).getAttribute("aria-describedby");

    expect(ids?.split(" ")).toStrictEqual([
      screen.getByText("Leaves overnight.").id,
      screen.getByText("£4.95").id,
    ]);
  });

  it("disables the input of a disabled card", async () => {
    await drawn(composed({}, { closed: "Same day" }));

    expect(screen.getByRole<HTMLInputElement>("radio", { name: "Same day" }).disabled).toBe(true);
  });

  it("keeps the inputs of a read-only set enabled", async () => {
    await drawn(composed({ defaultValue: "Standard", readOnly: true }));

    expect(screen.getAllByRole<HTMLInputElement>("radio").some((radio) => radio.disabled)).toBe(
      false,
    );
  });

  it("cancels a press on a card of a read-only set", async () => {
    await drawn(composed({ defaultValue: "Standard", readOnly: true }));

    expect(fireEvent.click(screen.getByRole("radio", { name: "Same day" }))).toBe(false);
  });

  it("sets data-state to checked on the checked card", async () => {
    const { container } = await drawn(composed({ defaultValue: "Next day" }));

    expect(
      [...container.querySelectorAll<HTMLElement>('[data-part="item"]')].map(
        (item) => item.dataset["state"],
      ),
    ).toStrictEqual(["unchecked", "checked", "unchecked"]);
  });
});
