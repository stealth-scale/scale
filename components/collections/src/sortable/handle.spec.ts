import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { listed } from "#sortable/sortable.fixtures.tsx";

function framed(): Promise<number> {
  return new Promise((resolve) => {
    requestAnimationFrame(resolve);
  });
}

describe("Handle", () => {
  it("names each handle after its row", () => {
    const { getAllByRole } = render(listed());

    expect(getAllByRole("button").map((button) => button.getAttribute("aria-label"))).toStrictEqual(
      ["Move Draft", "Move Review"],
    );
  });

  it("names each handle through the caller's handleLabel", () => {
    const { getAllByRole } = render(listed({ handleLabel: (item) => `Reorder ${item}` }));

    expect(getAllByRole("button")[0]?.getAttribute("aria-label")).toBe("Reorder Draft");
  });

  it("sets aria-roledescription to sortable by default", () => {
    const { getByRole } = render(listed());

    expect(getByRole("button", { name: "Move Draft" }).getAttribute("aria-roledescription")).toBe(
      "sortable",
    );
  });

  it("sets aria-roledescription to the caller's roleDescription", () => {
    const { getByRole } = render(listed({ roleDescription: "sortierbar" }));

    expect(getByRole("button", { name: "Move Draft" }).getAttribute("aria-roledescription")).toBe(
      "sortierbar",
    );
  });

  it("points aria-describedby at the root's instructions", () => {
    const { container, getByRole } = render(listed({ instructions: "Drag a stage." }));
    const id = getByRole("button", { name: "Move Draft" }).getAttribute("aria-describedby");

    expect(container.querySelector(`[id="${id ?? ""}"]`)?.textContent).toBe("Drag a stage.");
  });

  it("renders the caller's glyph", () => {
    const { getByRole } = render(listed());

    expect(getByRole("button", { name: "Move Draft" }).querySelector("svg")).not.toBeNull();
  });

  it("renders the recipe's handle class on the button", () => {
    const { container } = render(listed());

    expect(slotElement(container, "sortable", "handle").tagName).toBe("BUTTON");
  });

  it("renders a span with the recipe's fixed class for a disabled row", () => {
    const { getByText } = render(listed());
    const row = getByText("Publish").closest("li");

    expect(row === null ? undefined : slotElement(row, "sortable", "fixed").tagName).toBe("SPAN");
  });

  it("renders no button for a disabled row", () => {
    const { getByText } = render(listed());

    expect(getByText("Publish").closest("li")?.querySelector("button")).toBeNull();
  });

  it("renders the fixed box of a disabled row inert", () => {
    const { getByText } = render(listed());
    const row = getByText("Publish").closest("li");

    expect(
      row === null ? undefined : slotElement(row, "sortable", "fixed").hasAttribute("inert"),
    ).toBe(true);
  });

  it("leaves the li of a disabled row without a role once dnd-kit writes its attributes", async () => {
    const { getByText } = render(listed());

    await framed();

    expect(getByText("Publish").closest("li")?.hasAttribute("role")).toBe(false);
  });
});
