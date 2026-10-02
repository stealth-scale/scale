import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#floating-panel/floating-panel.fixtures.tsx";

describe("Header", () => {
  it("renders a div with the header class", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(slotElement(container, "floating-panel", "header").tagName).toBe("DIV");
  });

  it("writes the id the machine measures a minimized panel by", async () => {
    const { container } = await drawn(composed({ defaultOpen: true, id: "notes" }));

    expect(slotElement(container, "floating-panel", "header").id).toBe("float:notes:header");
  });
});
