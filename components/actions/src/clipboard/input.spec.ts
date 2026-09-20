import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { settled, violations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { clipped, composed, LINK } from "#clipboard/clipboard.fixtures.tsx";
import { Input } from "#clipboard/input.tsx";

describe("Input", () => {
  it("conforms as an input inside the root it needs above it", () => {
    expect(
      violations(Input, {
        as: true,
        element: "INPUT",
        subject: (container) => slotElement(container, "clipboard", "input"),
        wrapper: clipped,
      }),
    ).toStrictEqual([]);
  });

  it("shows the value read-only", () => {
    render(composed());

    const field = screen.getByLabelText<HTMLInputElement>("Link to the payout");

    expect(field.value).toBe(LINK);
    expect(field.readOnly).toBe(true);
  });

  it("selects the whole value on focus", () => {
    render(composed());

    const field = screen.getByLabelText<HTMLInputElement>("Link to the payout");
    const selected = vi.spyOn(field, "select");

    fireEvent.focus(field);

    expect(selected).toHaveBeenCalledExactlyOnceWith();
  });

  it("counts a copy made from the field", async () => {
    const { container } = render(composed());

    fireEvent.copy(screen.getByLabelText("Link to the payout"));
    await settled();

    expect(slotElement(container, "clipboard", "root").dataset["copied"]).toBe("");
  });

  it("follows the value a caller moves", () => {
    const { rerender } = render(composed());

    rerender(composed({ value: "4110" }));

    expect(screen.getByLabelText<HTMLInputElement>("Link to the payout").value).toBe("4110");
  });
});
