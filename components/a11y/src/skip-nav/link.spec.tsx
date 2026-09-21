import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Link, SKIP_NAV_TARGET } from "#skip-nav/link.ts";

describe("Link", () => {
  it("satisfies the component contract with a as its default element", () => {
    expect(violations(Link, { as: true, children: true, element: "A" })).toStrictEqual([]);
  });

  it("reports no axe violation when it renders label text", async () => {
    await expect(
      accessibilityViolations(Link, { props: { children: "Skip to content" } }),
    ).resolves.toStrictEqual([]);
  });

  it("sets href to the default fragment when the caller passes none", () => {
    const { container } = render(<Link>Skip to content</Link>);

    expect(slotElement(container, "skip-nav", "link").getAttribute("href")).toBe(
      `#${SKIP_NAV_TARGET}`,
    );
  });

  it("sets href to the fragment the caller passes", () => {
    const { container } = render(<Link href="#search">Skip to search</Link>);

    expect(slotElement(container, "skip-nav", "link").getAttribute("href")).toBe("#search");
  });

  it("exposes the link role named by its children", () => {
    const { getByRole } = render(<Link>Skip to content</Link>);

    expect(getByRole("link", { name: "Skip to content" })).toBeDefined();
  });
});
