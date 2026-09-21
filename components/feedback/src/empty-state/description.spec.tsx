import { type ReactElement, type ReactNode } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Description } from "#empty-state/description.ts";
import { Root } from "#empty-state/root.ts";

function panelled(children: ReactNode): ReactElement {
  return <Root>{children}</Root>;
}

describe("Description", () => {
  it("meets the component contract as a p element", () => {
    expect(
      violations(Description, {
        as: true,
        children: true,
        element: "P",
        subject: (container) => slotElement(container, "empty-state", "description"),
        wrapper: panelled,
      }),
    ).toStrictEqual([]);
  });

  it("reports no axe violation holding a sentence", async () => {
    await expect(
      accessibilityViolations(Description, {
        props: { children: "Add one to get started." },
        wrapper: panelled,
      }),
    ).resolves.toStrictEqual([]);
  });

  it("renders the element named by as instead of a p", () => {
    const { container } = render(panelled(<Description as="span">Add one.</Description>));

    expect(slotElement(container, "empty-state", "description").tagName).toBe("SPAN");
  });
});
