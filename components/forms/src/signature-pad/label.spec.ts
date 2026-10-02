import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { composed, hiddenInput } from "#signature-pad/signature-pad.fixtures.tsx";

describe("Label", () => {
  it("renders a label element", async () => {
    await drawn(composed());

    expect(screen.getByText("Signature").tagName).toBe("LABEL");
  });

  it("points at the hidden input", async () => {
    const { container } = await drawn(composed());

    expect(screen.getByText<HTMLLabelElement>("Signature").htmlFor).toBe(hiddenInput(container).id);
  });

  it("focuses the control on a press", async () => {
    await drawn(composed());

    act(() => {
      fireEvent.click(screen.getByText("Signature"));
    });
    await settled();

    expect(document.activeElement).toBe(screen.getByRole("application"));
  });

  it("names the group only while it is mounted", async () => {
    const { rerender } = await drawn(composed());

    rerender(composed({}, { labelled: false }));
    await settled();

    expect(screen.getByRole("group").getAttribute("aria-labelledby")).toBeNull();
  });
});
