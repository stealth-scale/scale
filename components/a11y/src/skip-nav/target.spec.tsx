import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { SKIP_NAV_TARGET } from "#skip-nav/link.ts";
import { Target } from "#skip-nav/target.ts";

describe("Target", () => {
  it("passes the component conformance checks as a div element", () => {
    expect(violations(Target, { as: true, children: true, element: "DIV" })).toStrictEqual([]);
  });

  it("returns no accessibility violation with a paragraph", async () => {
    await expect(
      accessibilityViolations(Target, { props: { children: <p>One</p> } }),
    ).resolves.toStrictEqual([]);
  });

  it("sets id to the default fragment when the caller passes none", () => {
    const { container } = render(<Target />);

    expect(slotElement(container, "skip-nav", "target").getAttribute("id")).toBe(SKIP_NAV_TARGET);
  });

  it("sets tabIndex to -1", () => {
    const { container } = render(<Target />);

    expect(slotElement(container, "skip-nav", "target").getAttribute("tabindex")).toBe("-1");
  });

  it("renders a main element when as is main", () => {
    const { container } = render(<Target as="main" />);

    expect(slotElement(container, "skip-nav", "target").tagName).toBe("MAIN");
  });
});
