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
  it("conforms as a div element inside the root", () => {
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

  it("returns no accessibility violation when it holds text", async () => {
    await expect(
      accessibilityViolations(Content, {
        props: { children: "Nothing here yet" },
        wrapper: panelled,
      }),
    ).resolves.toStrictEqual([]);
  });

  it("renders the element passed as as", () => {
    const { container } = render(panelled(<Content as="section">Nothing here yet</Content>));

    expect(slotElement(container, "empty-state", "content").tagName).toBe("SECTION");
  });
});
