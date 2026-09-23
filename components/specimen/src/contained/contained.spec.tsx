import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { recipeClasses } from "@stealthscale/testing-theme";

import { Contained } from "#contained/contained.ts";

describe("Contained", () => {
  it("passes the component conformance checks as a div element", () => {
    expect(violations(Contained, { as: true, children: true, element: "DIV" })).toStrictEqual([]);
  });

  it("returns no accessibility violation with a link", async () => {
    await expect(
      accessibilityViolations(Contained, { props: { children: <a href="#content">Skip</a> } }),
    ).resolves.toStrictEqual([]);
  });

  it("applies the contained class", () => {
    const { container } = render(<Contained>Draft</Contained>);

    expect(recipeClasses(container, "contained")).toContain("contained");
  });
});
