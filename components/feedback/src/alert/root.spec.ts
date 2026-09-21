import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { composed } from "#alert/alert.fixtures.tsx";
import { recipe } from "#alert/recipe.ts";
import { Root, type RootProps } from "#alert/root.tsx";

describe("Root", () => {
  it("meets the component contract as a div element", () => {
    expect(violations(Root, { as: true, children: true, element: "DIV" })).toStrictEqual([]);
  });

  it("reports no axe violation with all six slots populated", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("emits a class for every variant value the recipe declares", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "root",
      }),
    ).toStrictEqual([]);
  });

  it("takes the status role when live is left unset", () => {
    render(composed());

    expect(screen.getByRole("status")).toBeDefined();
  });

  it("takes the alert role when live is assertive", () => {
    render(composed({ live: "assertive" }));

    expect(screen.getByRole("alert")).toBeDefined();
  });

  it("sets no role attribute when live is off", () => {
    const { container } = render(composed({ live: "off" }));

    expect(slotElement(container, "alert", "root").hasAttribute("role")).toBe(false);
  });

  it("keeps an explicit role prop over the one live selected", () => {
    const { container } = render(composed({ live: "assertive", role: "note" }));

    expect(slotElement(container, "alert", "root").getAttribute("role")).toBe("note");
  });

  it("renders the element named by as instead of a div", () => {
    const { container } = render(composed({ as: "section" }));

    expect(slotElement(container, "alert", "root").tagName).toBe("SECTION");
  });
});
