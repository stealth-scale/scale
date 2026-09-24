import { createRef } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { recipe } from "#table/recipe.ts";
import { Scroller, type ScrollerProps } from "#table/scroller.tsx";
import { composed } from "#table/table.fixtures.tsx";

/**
 * Sets every element's `clientWidth` to 100 and `scrollWidth` to 300, and returns the function
 * that restores them.
 *
 * @remarks
 *   Happy-dom has no layout, so the case states the widths on the prototype before the scroller
 *   measures itself.
 */
function widened(): () => void {
  const held = { clientWidth: 100, scrollWidth: 300 };

  for (const [name, value] of Object.entries(held)) {
    Object.defineProperty(HTMLElement.prototype, name, { configurable: true, value });
  }

  return (): void => {
    for (const name of Object.keys(held)) {
      Reflect.deleteProperty(HTMLElement.prototype, name);
    }
  };
}

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

  it("sets no tabindex while the table fits", () => {
    const { container } = render(composed());

    expect(slotElement(container, "table", "scroller").getAttribute("tabindex")).toBeNull();
  });

  it("sets tabindex 0 while the table overflows", () => {
    const narrowed = widened();

    try {
      const { container } = render(composed());

      expect(slotElement(container, "table", "scroller").getAttribute("tabindex")).toBe("0");
    } finally {
      narrowed();
    }
  });

  it("sets no role while the table fits", () => {
    const { container } = render(composed());

    expect(slotElement(container, "table", "scroller").getAttribute("role")).toBeNull();
  });

  it("renders a region named by the caption while the table overflows", () => {
    const narrowed = widened();

    try {
      render(composed());

      expect(screen.getByRole("region", { name: "Invoices this quarter" })).toBeTruthy();
    } finally {
      narrowed();
    }
  });

  it("passes the element to a callback ref", () => {
    let held: HTMLDivElement | null = null;

    render(
      composed({
        ref: (node) => {
          held = node;
        },
      }),
    );

    expect((held as HTMLDivElement | null)?.tagName).toBe("DIV");
  });

  it("passes the element to an object ref", () => {
    const held = createRef<HTMLDivElement>();

    render(composed({ ref: held }));

    expect(held.current?.tagName).toBe("DIV");
  });

  it("passes aria-labelledby to the element", () => {
    const { container } = render(composed());

    expect(slotElement(container, "table", "scroller").getAttribute("aria-labelledby")).toBe(
      "table-caption",
    );
  });

  it("renders the element as names", () => {
    const { container } = render(composed({ as: "section" }));

    expect(slotElement(container, "table", "scroller").tagName).toBe("SECTION");
  });
});
