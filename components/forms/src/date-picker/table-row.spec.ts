import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { inlined } from "#date-picker/date-picker.fixtures.tsx";

describe("TableRow", () => {
  it("renders a tr", async () => {
    const { container } = await drawn(inlined());

    expect(slotElement(container, "date-picker", "tableRow").tagName).toBe("TR");
  });

  it("sets data-view to the view of its table", async () => {
    await drawn(inlined({ defaultView: "month" }));

    expect(
      screen.getByRole("grid", { name: "2026" }).querySelector<HTMLElement>("tbody tr")?.dataset[
        "view"
      ],
    ).toBe("month");
  });

  it("sets aria-disabled in a disabled picker", async () => {
    const { container } = await drawn(inlined({ disabled: true }));

    expect(slotElement(container, "date-picker", "tableRow").getAttribute("aria-disabled")).toBe(
      "true",
    );
  });
});
