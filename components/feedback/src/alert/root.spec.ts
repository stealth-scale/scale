import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { composed } from "#alert/alert.fixtures.tsx";
import { recipe } from "#alert/recipe.ts";
import { Root, type RootProps } from "#alert/root.tsx";

describe("Root", () => {
  it("conforms as a div element", () => {
    expect(violations(Root, { as: true, children: true, element: "DIV" })).toStrictEqual([]);
  });

  it("returns no accessibility violation when it holds every part", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("applies the class of every variant value", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "root",
      }),
    ).toStrictEqual([]);
  });

  it("sets the status role when live is absent", () => {
    render(composed());

    expect(screen.getByRole("status")).toBeDefined();
  });

  it("sets the alert role when live is assertive", () => {
    render(composed({ live: "assertive" }));

    expect(screen.getByRole("alert")).toBeDefined();
  });

  it("sets no role when live is off", () => {
    const { container } = render(composed({ live: "off" }));

    expect(slotElement(container, "alert", "root").hasAttribute("role")).toBe(false);
  });

  it("keeps a role prop over the role of live", () => {
    const { container } = render(composed({ live: "assertive", role: "note" }));

    expect(slotElement(container, "alert", "root").getAttribute("role")).toBe("note");
  });

  it("renders the element passed as as", () => {
    const { container } = render(composed({ as: "section" }));

    expect(slotElement(container, "alert", "root").tagName).toBe("SECTION");
  });
});
