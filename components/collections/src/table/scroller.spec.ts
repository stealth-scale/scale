import { createRef } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { recipe } from "#table/recipe.ts";
import { Scroller, type ScrollerProps } from "#table/scroller.tsx";
import { composed } from "#table/table.fixtures.tsx";

describe("Scroller", () => {
  it("conforms as a div", () => {
    expect(violations(Scroller, { as: true, children: true, element: "DIV" })).toStrictEqual([]);
  });

  it("returns no accessibility violation for a whole table", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("applies the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: ScrollerProps) => render(composed(props)).container, {
        slot: "scroller",
      }),
    ).toStrictEqual([]);
  });

  it("renders the table inside the scroll area's viewport", () => {
    const { container } = render(composed());

    expect(slotElement(container, "table", "root").closest(".table__viewport")).toBe(
      slotElement(container, "table", "viewport"),
    );
  });

  it("scrolls the table in both axes", () => {
    const { container } = render(composed());

    expect(slotElement(container, "table", "root").parentElement?.className).toContain(
      "scroll-area__content--both",
    );
  });

  it("passes aria-labelledby to the viewport", () => {
    const { container } = render(composed());

    expect(slotElement(container, "table", "viewport").getAttribute("aria-labelledby")).toBe(
      "table-caption",
    );
  });

  it("passes aria-label to the viewport", () => {
    const { container } = render(
      composed({ "aria-label": "Invoices", "aria-labelledby": undefined }),
    );

    expect(slotElement(container, "table", "viewport").getAttribute("aria-label")).toBe("Invoices");
  });

  it("keeps the viewport out of the tab order when focusable is false", () => {
    const { container } = render(composed({ focusable: false }));

    expect(slotElement(container, "table", "viewport").getAttribute("tabindex")).toBe("-1");
  });

  it("leaves the viewport without a tab stop while the table fits", () => {
    const { container } = render(composed());

    expect(slotElement(container, "table", "viewport").getAttribute("tabindex")).toBeNull();
  });

  it("leaves the name off the scroller", () => {
    const { container } = render(composed());

    expect(slotElement(container, "table", "scroller").hasAttribute("aria-labelledby")).toBe(false);
  });

  it("passes the scroller to a callback ref", () => {
    let held: HTMLDivElement | null = null;

    render(
      composed({
        ref: (node) => {
          held = node;
        },
      }),
    );

    expect((held as HTMLDivElement | null)?.className).toContain("table__scroller");
  });

  it("passes the scroller to an object ref", () => {
    const held = createRef<HTMLDivElement>();

    render(composed({ ref: held }));

    expect(held.current?.className).toContain("table__scroller");
  });

  it("renders the element as names", () => {
    const { container } = render(composed({ as: "section" }));

    expect(slotElement(container, "table", "scroller").tagName).toBe("SECTION");
  });
});
