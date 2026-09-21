import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { composed, SOURCE } from "#code-block/code-block.fixtures.tsx";
import { recipe } from "#code-block/recipe.ts";
import { Root } from "#code-block/root.tsx";

describe("Root", () => {
  it("satisfies the component contract with div as its default element", () => {
    expect(
      violations(Root, { as: true, children: true, element: "DIV", props: { code: SOURCE } }),
    ).toStrictEqual([]);
  });

  it("reports no axe violation with every slot composed", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("emits a class for every variant value the recipe declares", () => {
    expect(
      boundViolations(recipe, (props) => render(composed(props)).container, { slot: "root" }),
    ).toStrictEqual([]);
  });

  it("sets the colour mode attribute to dark when no mode is given", () => {
    const { container } = render(composed());

    expect(slotElement(container, "code-block", "root").dataset["colorMode"]).toBe("dark");
  });

  it("sets the colour mode attribute to light when mode is light", () => {
    const { container } = render(composed({ mode: "light" }));

    expect(slotElement(container, "code-block", "root").dataset["colorMode"]).toBe("light");
  });

  it("omits the colour mode attribute when mode is inherit", () => {
    const { container } = render(composed({ mode: "inherit" }));

    expect(slotElement(container, "code-block", "root").dataset["colorMode"]).toBeUndefined();
  });

  it("publishes the code prop to the code slot below it", () => {
    const { container } = render(composed());

    expect(slotElement(container, "code-block", "code").textContent).toBe(SOURCE);
  });

  it("renders the root slot as section when as is section", () => {
    const { container } = render(composed({ as: "section" }));

    expect(slotElement(container, "code-block", "root").tagName).toBe("SECTION");
  });
});
