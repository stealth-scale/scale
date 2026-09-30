import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#editable/editable.fixtures.tsx";

describe("Area", () => {
  it("renders a div that contains the preview and the input", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "editable", "area").children).toHaveLength(2);
  });

  it("marks itself while the placeholder shows", async () => {
    const { container } = await drawn(composed({ defaultValue: "" }));

    expect(slotElement(container, "editable", "area").dataset["placeholderShown"]).toBe("");
  });
});
