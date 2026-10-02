import { type ReactElement, type ReactNode } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Indicator } from "#empty-state/indicator.ts";
import { Root } from "#empty-state/root.ts";

function panelled(children: ReactNode): ReactElement {
  return <Root>{children}</Root>;
}

describe("Indicator", () => {
  it("conforms as a div element inside the root", () => {
    expect(
      violations(Indicator, {
        as: true,
        children: true,
        element: "DIV",
        subject: (container) => slotElement(container, "empty-state", "indicator"),
        wrapper: panelled,
      }),
    ).toStrictEqual([]);
  });

  it("returns no accessibility violation", async () => {
    await expect(
      accessibilityViolations(Indicator, { props: { children: "*" }, wrapper: panelled }),
    ).resolves.toStrictEqual([]);
  });

  it("sets aria-hidden to true by default", () => {
    const { container } = render(panelled(<Indicator>*</Indicator>));

    expect(slotElement(container, "empty-state", "indicator").getAttribute("aria-hidden")).toBe(
      "true",
    );
  });

  it("renders the element passed as as", () => {
    const { container } = render(panelled(<Indicator as="span">*</Indicator>));

    expect(slotElement(container, "empty-state", "indicator").tagName).toBe("SPAN");
  });
});
