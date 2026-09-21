import { type ReactElement, type ReactNode } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Content } from "#empty-state/content.ts";
import { Root } from "#empty-state/root.ts";

function panelled(children: ReactNode): ReactElement {
  return <Root>{children}</Root>;
}

describe("Content", () => {
  it("meets the component contract as a div element", () => {
    expect(
      violations(Content, {
        as: true,
        children: true,
        element: "DIV",
        subject: (container) => slotElement(container, "empty-state", "content"),
        wrapper: panelled,
      }),
    ).toStrictEqual([]);
  });

  it("reports no axe violation holding plain text", async () => {
    await expect(
      accessibilityViolations(Content, {
        props: { children: "Nothing here yet" },
        wrapper: panelled,
      }),
    ).resolves.toStrictEqual([]);
  });

  it("renders the element named by as instead of a div", () => {
    const { container } = render(panelled(<Content as="section">Nothing here yet</Content>));

    expect(slotElement(container, "empty-state", "content").tagName).toBe("SECTION");
  });
});
