import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Label } from "#tag/label.ts";
import { tagged } from "#tag/tag.fixtures.tsx";

describe("Label", () => {
  it("renders a SPAN for the label slot", () => {
    const { container } = render(tagged(<Label>payouts</Label>));

    expect(slotElement(container, "tag", "label").tagName).toBe("SPAN");
  });

  it("keeps the whole label in the DOM when it is truncated", () => {
    const long = "reconciliation-2026-Q1-north-europe";
    const { container } = render(tagged(<Label>{long}</Label>));

    expect(slotElement(container, "tag", "label").textContent).toBe(long);
  });
});
