import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { box, composed } from "#pin-input/pin-input.fixtures.tsx";

describe("Label", () => {
  it("renders a label element", async () => {
    await drawn(composed());

    expect(screen.getByText("Code").tagName).toBe("LABEL");
  });

  it("focuses the first box on a press", async () => {
    await drawn(composed());
    fireEvent.click(screen.getByText("Code"));
    await settled();

    expect(document.activeElement).toBe(box(0));
  });

  it("names the group only while it is mounted", async () => {
    const { rerender } = await drawn(composed());

    rerender(composed({}, false));
    await settled();

    expect(screen.getByRole("group").getAttribute("aria-labelledby")).toBeNull();
  });
});
