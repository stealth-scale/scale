import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { composed, pressed } from "#toggle-group/toggle-group.fixtures.tsx";

describe("Item", () => {
  it("renders a button of type button for each item", async () => {
    const { container } = await drawn(composed());

    expect([...container.querySelectorAll("button")].map((item) => item.type)).toStrictEqual([
      "button",
      "button",
      "button",
    ]);
  });

  it("reports aria-checked on a single-select item", async () => {
    await drawn(composed({ defaultValue: ["Italic"] }));

    expect(screen.getByRole("radio", { name: "Italic" }).getAttribute("aria-checked")).toBe("true");
  });

  it("reports aria-pressed on a multiple-select item", async () => {
    await drawn(composed({ defaultValue: ["Italic"], multiple: true }));

    expect(screen.getByRole("button", { name: "Italic" }).getAttribute("aria-pressed")).toBe(
      "true",
    );
  });

  it("sets data-pressed on an item that is on", async () => {
    await drawn(composed({ defaultValue: ["Italic"] }));

    expect(screen.getByRole("radio", { name: "Italic" }).dataset["pressed"]).toBe("");
  });

  it("sets no data-pressed on an item that is off", async () => {
    await drawn(composed({ defaultValue: ["Italic"] }));

    expect(screen.getByRole("radio", { name: "Bold" }).dataset["pressed"]).toBeUndefined();
  });

  it("turns an item on when a person presses it", async () => {
    await drawn(composed());
    await pressed(screen.getByRole("radio", { name: "Small caps" }));

    expect(screen.getByRole("radio", { name: "Small caps" }).dataset["pressed"]).toBe("");
  });

  it("disables a disabled item", async () => {
    await drawn(composed({}, "Italic"));

    expect(screen.getByRole<HTMLButtonElement>("radio", { name: "Italic" }).disabled).toBe(true);
  });

  it("scrolls the item an arrow key focuses into view", async () => {
    const reveal = vi.spyOn(HTMLElement.prototype, "scrollIntoView");

    await drawn(composed());
    act(() => {
      screen.getByRole("radio", { name: "Bold" }).focus();
    });
    fireEvent.keyDown(screen.getByRole("radio", { name: "Bold" }), { key: "ArrowRight" });
    await settled();

    expect([reveal.mock.contexts.at(-1), reveal.mock.lastCall]).toStrictEqual([
      screen.getByRole("radio", { name: "Italic" }),
      [{ block: "nearest", inline: "nearest" }],
    ]);
  });

  it("gives a value with a space an ID without a space", async () => {
    await drawn(composed());

    expect(screen.getByRole("radio", { name: "Small caps" }).id).not.toMatch(/\s/u);
  });
});
