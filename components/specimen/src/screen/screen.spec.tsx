import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, drawn, violations } from "@stealthscale/testing-react";
import { recipeClasses, variantClass } from "@stealthscale/testing-theme";

import { SCROLLER, VIEWPORT } from "#screen/recipe.ts";
import { Screen } from "#screen/screen.ts";

describe("Screen", () => {
  it("passes the component conformance checks as a div element", () => {
    expect(violations(Screen, { as: true, children: true, element: "DIV" })).toStrictEqual([]);
  });

  it("returns no accessibility violation with a link", async () => {
    await expect(
      accessibilityViolations(Screen, { props: { children: <a href="#runs">Runs</a> } }),
    ).resolves.toStrictEqual([]);
  });

  it("applies the screen class", () => {
    const { container } = render(<Screen>Runs</Screen>);

    expect(recipeClasses(container, "screen")).toContain("screen");
  });

  it("applies the class of the size passed as size", () => {
    const { container } = render(<Screen size="xl">Runs</Screen>);

    expect(recipeClasses(container, "screen")).toContain(variantClass("screen", "size", "xl"));
  });

  it("renders its content in a scroll area when scrolls is true", async () => {
    const { container } = await drawn(
      <Screen scrolls size="xs">
        Runs
      </Screen>,
    );

    expect(container.querySelector(".scroll-area__content")?.textContent).toBe("Runs");
  });

  it("renders the scroll area's root and viewport where its selectors find them", async () => {
    const { container } = await drawn(
      <Screen scrolls size="xs">
        Runs
      </Screen>,
    );

    expect(container.querySelector(`.screen ${SCROLLER.slice(2)}`)).toBe(
      container.querySelector(".scroll-area__root"),
    );
    expect(container.querySelector(`.screen ${VIEWPORT.slice(2)}`)).toBe(
      container.querySelector(".scroll-area__viewport"),
    );
  });

  it("keeps the scroll area's viewport out of the tab order", async () => {
    const { container } = await drawn(
      <Screen scrolls size="xs">
        Runs
      </Screen>,
    );

    expect(container.querySelector(".scroll-area__viewport")?.getAttribute("tabindex")).toBe("-1");
  });

  it("renders its content without a scroll area by default", () => {
    const { container } = render(<Screen size="xs">Runs</Screen>);

    expect(container.querySelector(".scroll-area__root")).toBeNull();
  });
});
