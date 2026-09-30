import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { inlined } from "#date-picker/date-picker.fixtures.tsx";

describe("TableHeader", () => {
  it("renders a th that heads its column", async () => {
    const { container } = await drawn(inlined());
    const header = slotElement(container, "date-picker", "tableHeader");

    expect([header.tagName, header.getAttribute("scope")]).toStrictEqual(["TH", "col"]);
  });

  it("sets data-view to the view of its table", async () => {
    const { container } = await drawn(inlined());

    expect(slotElement(container, "date-picker", "tableHeader").dataset["view"]).toBe("day");
  });
});
