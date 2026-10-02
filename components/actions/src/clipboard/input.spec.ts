import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { settled, violations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { clipped, composed, LINK } from "#clipboard/clipboard.fixtures.tsx";
import { Input } from "#clipboard/input.tsx";

describe("Input", () => {
  it("returns no conformance violation for its INPUT slot inside a root", () => {
    expect(
      violations(Input, {
        as: true,
        element: "INPUT",
        subject: (container) => slotElement(container, "clipboard", "input"),
        wrapper: clipped,
      }),
    ).toStrictEqual([]);
  });

  it("renders the machine's value as the field's value", () => {
    render(composed());

    expect(screen.getByLabelText<HTMLInputElement>("Link to the payout").value).toBe(LINK);
  });

  it("renders the field read-only and enabled", () => {
    render(composed());

    expect(screen.getByLabelText<HTMLInputElement>("Link to the payout").readOnly).toBe(true);
  });

  it("calls select on the field when it receives focus", () => {
    render(composed());

    const field = screen.getByLabelText<HTMLInputElement>("Link to the payout");
    const selected = vi.spyOn(field, "select");

    fireEvent.focus(field);

    expect(selected).toHaveBeenCalledExactlyOnceWith();
  });

  it("sets data-copied on the root when a copy event fires on the field", async () => {
    const { container } = render(composed());

    fireEvent.copy(screen.getByLabelText("Link to the payout"));
    await settled();

    expect(slotElement(container, "clipboard", "root").dataset["copied"]).toBe("");
  });

  it("updates the field when the root is rerendered with another value", () => {
    const { rerender } = render(composed());

    rerender(composed({ value: "4110" }));

    expect(screen.getByLabelText<HTMLInputElement>("Link to the payout").value).toBe("4110");
  });
});
