import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { inlined } from "#date-picker/date-picker.fixtures.tsx";

describe("TableHead", () => {
  it("renders a thead hidden from assistive technology", async () => {
    const { container } = await drawn(inlined());
    const head = slotElement(container, "date-picker", "tableHead");

    expect([head.tagName, head.getAttribute("aria-hidden")]).toStrictEqual(["THEAD", "true"]);
  });

  it("sets data-view to the view of its table", async () => {
    const { container } = await drawn(inlined());

    expect(slotElement(container, "date-picker", "tableHead").dataset["view"]).toBe("day");
  });
});
