import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { clipped, LINK } from "#clipboard/clipboard.fixtures.tsx";
import { ValueText } from "#clipboard/value-text.tsx";

describe("ValueText", () => {
  it("returns no conformance violation for its SPAN slot inside a root", () => {
    expect(
      violations(ValueText, {
        as: true,
        children: true,
        element: "SPAN",
        subject: (container) => slotElement(container, "clipboard", "valueText"),
        wrapper: clipped,
      }),
    ).toStrictEqual([]);
  });

  it("renders the machine's value when given no children", () => {
    const { container } = render(clipped(<ValueText />));

    expect(slotElement(container, "clipboard", "valueText").textContent).toBe(LINK);
  });

  it("renders the children in place of the machine's value", () => {
    const { container } = render(clipped(<ValueText>The payout link</ValueText>));

    expect(slotElement(container, "clipboard", "valueText").textContent).toBe("The payout link");
  });
});
