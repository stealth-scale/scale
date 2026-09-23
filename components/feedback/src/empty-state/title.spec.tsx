import { type ReactElement, type ReactNode } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Root } from "#empty-state/root.ts";
import { Title } from "#empty-state/title.ts";

function panelled(children: ReactNode): ReactElement {
  return <Root>{children}</Root>;
}

describe("Title", () => {
  it("conforms as an h2 element inside the root", () => {
    expect(
      violations(Title, {
        as: true,
        children: true,
        element: "H2",
        subject: (container) => slotElement(container, "empty-state", "title"),
        wrapper: panelled,
      }),
    ).toStrictEqual([]);
  });

  it("returns no accessibility violation when it holds text", async () => {
    await expect(
      accessibilityViolations(Title, {
        props: { children: "Nothing here yet" },
        wrapper: panelled,
      }),
    ).resolves.toStrictEqual([]);
  });

  it("renders the element passed as as", () => {
    const { container } = render(panelled(<Title as="h3">Nothing here yet</Title>));

    expect(slotElement(container, "empty-state", "title").tagName).toBe("H3");
  });
});
