import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { composed, pressed } from "#radio-group/radio-group.fixtures.tsx";

describe("Item", () => {
  it("renders a label around each option", async () => {
    const { container } = await drawn(composed());

    expect(
      [...container.querySelectorAll('[data-part="item"]')].map((item) => item.tagName),
    ).toStrictEqual(["LABEL", "LABEL", "LABEL"]);
  });

  it("points the label's for attribute at its input", async () => {
    const { container } = await drawn(composed());
    const item = container.querySelector('[data-part="item"]');

    expect(item?.getAttribute("for")).toBe(screen.getByRole("radio", { name: "Same day" }).id);
  });

  it("renders a radio input with the item's value", async () => {
    await drawn(composed());

    expect(screen.getByRole<HTMLInputElement>("radio", { name: "Next day" }).value).toBe(
      "Next day",
    );
  });

  it("gives a value with a space IDs without a space", async () => {
    await drawn(composed());

    expect(screen.getByRole("radio", { name: "Same day" }).id).not.toMatch(/\s/u);
  });

  it("checks its option on a press on its words", async () => {
    await drawn(composed());
    await pressed(screen.getByText("Weekly"));

    expect(screen.getByRole<HTMLInputElement>("radio", { name: "Weekly" }).checked).toBe(true);
  });

  it("disables the input of a disabled item", async () => {
    await drawn(composed({}, { closed: "Weekly" }));

    expect(screen.getByRole<HTMLInputElement>("radio", { name: "Weekly" }).disabled).toBe(true);
  });

  it("keeps the inputs of a read-only group enabled", async () => {
    await drawn(composed({ defaultValue: "Next day", readOnly: true }));

    expect(screen.getAllByRole<HTMLInputElement>("radio").some((radio) => radio.disabled)).toBe(
      false,
    );
  });

  it("cancels a press on an option of a read-only group", async () => {
    await drawn(composed({ defaultValue: "Next day", readOnly: true }));

    expect(fireEvent.click(screen.getByRole("radio", { name: "Weekly" }))).toBe(false);
  });

  it("leaves the other inputs enabled beside a disabled item", async () => {
    await drawn(composed({}, { closed: "Weekly" }));

    expect(screen.getByRole<HTMLInputElement>("radio", { name: "Same day" }).disabled).toBe(false);
  });

  it("sets data-state to checked on the checked option", async () => {
    const { container } = await drawn(composed({ defaultValue: "Next day" }));

    expect(
      [...container.querySelectorAll<HTMLElement>('[data-part="item"]')].map(
        (item) => item.dataset["state"],
      ),
    ).toStrictEqual(["unchecked", "checked", "unchecked"]);
  });
});
