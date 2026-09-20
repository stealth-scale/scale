import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { clipped, LINK } from "#clipboard/clipboard.fixtures.tsx";
import { ValueText } from "#clipboard/value-text.tsx";

describe("ValueText", () => {
  it("conforms as a span inside the root it needs above it", () => {
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

  it("writes the value where a caller writes nothing", () => {
    const { container } = render(clipped(<ValueText />));

    expect(slotElement(container, "clipboard", "valueText").textContent).toBe(LINK);
  });

  it("keeps the words a caller writes", () => {
    const { container } = render(clipped(<ValueText>The payout link</ValueText>));

    expect(slotElement(container, "clipboard", "valueText").textContent).toBe("The payout link");
  });
});
