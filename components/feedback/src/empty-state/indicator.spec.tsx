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
  it("meets the component contract as a div element", () => {
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

  it("reports no axe violation when the caller sets aria-hidden on it", async () => {
    await expect(
      accessibilityViolations(Indicator, {
        props: { "aria-hidden": true, children: "*" },
        wrapper: panelled,
      }),
    ).resolves.toStrictEqual([]);
  });

  it("renders the element named by as instead of a div", () => {
    const { container } = render(panelled(<Indicator as="span">*</Indicator>));

    expect(slotElement(container, "empty-state", "indicator").tagName).toBe("SPAN");
  });
});
