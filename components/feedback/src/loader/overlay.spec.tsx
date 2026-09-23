import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { slotElement, variantClass } from "@stealthscale/testing-theme";

import { LoaderOverlay } from "#loader/overlay.ts";

describe("LoaderOverlay", () => {
  it("returns no conformance violation for its DIV root", () => {
    expect(violations(LoaderOverlay, { as: true, children: true, element: "DIV" })).toStrictEqual(
      [],
    );
  });

  it("returns no accessibility violation when it renders on its own", async () => {
    await expect(accessibilityViolations(LoaderOverlay)).resolves.toStrictEqual([]);
  });

  it("applies the scrim class passed as scrim", () => {
    const { container } = render(<LoaderOverlay scrim="glass" />);

    expect(slotElement(container, "loader", "overlay").className).toContain(
      variantClass("loader__overlay", "scrim", "glass"),
    );
  });
});
