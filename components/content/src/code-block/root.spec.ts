import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { composed, SOURCE } from "#code-block/code-block.fixtures.tsx";
import { recipe } from "#code-block/recipe.ts";
import { Root } from "#code-block/root.tsx";

describe("Root", () => {
  it("conforms as a div", () => {
    expect(
      violations(Root, { as: true, children: true, element: "DIV", props: { code: SOURCE } }),
    ).toStrictEqual([]);
  });

  it("breaks no accessibility rule holding a header and the code", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props) => render(composed(props)).container, { slot: "root" }),
    ).toStrictEqual([]);
  });

  it("switches the panel to the dark mode whatever the page is in", () => {
    const { container } = render(composed());

    expect(slotElement(container, "code-block", "root").dataset["colorMode"]).toBe("dark");
  });

  it("switches the panel to the light mode where a caller says so", () => {
    const { container } = render(composed({ mode: "light" }));

    expect(slotElement(container, "code-block", "root").dataset["colorMode"]).toBe("light");
  });

  it("leaves the panel in the page's mode where a caller says inherit", () => {
    const { container } = render(composed({ mode: "inherit" }));

    expect(slotElement(container, "code-block", "root").dataset["colorMode"]).toBeUndefined();
  });

  it("hands the code to the passage", () => {
    const { container } = render(composed());

    expect(slotElement(container, "code-block", "code").textContent).toBe(SOURCE);
  });

  it("draws the element as names", () => {
    const { container } = render(composed({ as: "section" }));

    expect(slotElement(container, "code-block", "root").tagName).toBe("SECTION");
  });
});
