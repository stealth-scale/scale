import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { detailed } from "#details/details.fixtures.tsx";
import { recipe } from "#details/recipe.ts";
import { Root, type RootProps } from "#details/root.ts";

describe("Root", () => {
  it("passes the component conformance checks as a details element", () => {
    expect(violations(Root, { as: true, children: true, element: "DETAILS" })).toStrictEqual([]);
  });

  it("returns no accessibility violation for a closed details", async () => {
    await expect(accessibilityViolations(() => detailed())).resolves.toStrictEqual([]);
  });

  it("returns no accessibility violation for an open details", async () => {
    await expect(accessibilityViolations(() => detailed({ open: true }))).resolves.toStrictEqual(
      [],
    );
  });

  it("applies the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(detailed(props)).container, {
        slot: "root",
      }),
    ).toStrictEqual([]);
  });

  it("renders closed by default", () => {
    const { container } = render(detailed());

    expect(slotElement(container, "details", "root").getAttribute("open")).toBeNull();
  });

  it("renders open when open is set", () => {
    const { container } = render(detailed({ open: true }));

    expect(slotElement(container, "details", "root").getAttribute("open")).toBe("");
  });

  it("passes name to the element", () => {
    const { container } = render(detailed({ name: "payout-questions" }));

    expect(slotElement(container, "details", "root").getAttribute("name")).toBe("payout-questions");
  });

  it("shows the summary's text", () => {
    render(detailed());

    expect(screen.getByText("Refund policy").tagName).toBe("SUMMARY");
  });
});
