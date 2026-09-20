import { createRef } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { recipe } from "#table/recipe.ts";
import { Scroller, type ScrollerProps } from "#table/scroller.tsx";
import { composed } from "#table/table.fixtures.tsx";

/**
 * Says every box holds more across than it can show, and reports how to stop saying it.
 *
 * @remarks
 *   Stated on the prototype rather than on one element, because the box measures itself as it is
 *   drawn and a document with no layout reports every measure as nothing.
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

  it("breaks no accessibility rule holding a whole table", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: ScrollerProps) => render(composed(props)).container, {
        slot: "scroller",
      }),
    ).toStrictEqual([]);
  });

  it("takes no tab stop while the whole table fits", () => {
    const { container } = render(composed());

    expect(slotElement(container, "table", "scroller").getAttribute("tabindex")).toBeNull();
  });

  it("is reachable by a keyboard once the table runs past it", () => {
    const narrowed = widened();

    try {
      const { container } = render(composed());

      expect(slotElement(container, "table", "scroller").getAttribute("tabindex")).toBe("0");
    } finally {
      narrowed();
    }
  });

  it("stands as no landmark while the whole table fits", () => {
    const { container } = render(composed());

    expect(slotElement(container, "table", "scroller").getAttribute("role")).toBeNull();
  });

  it("stands as a region once the table runs past it", () => {
    const narrowed = widened();

    try {
      render(composed());

      expect(screen.getByRole("region", { name: "Invoices this quarter" })).toBeTruthy();
    } finally {
      narrowed();
    }
  });

  it("hands the box back through a ref a caller passes as a function", () => {
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

  it("hands the box back through a ref a caller passes as an object", () => {
    const held = createRef<HTMLDivElement>();

    render(composed({ ref: held }));

    expect(held.current?.tagName).toBe("DIV");
  });

  it("takes the name the caption gives it", () => {
    const { container } = render(composed());

    expect(slotElement(container, "table", "scroller").getAttribute("aria-labelledby")).toBe(
      "table-caption",
    );
  });

  it("draws the element as names", () => {
    const { container } = render(composed({ as: "section" }));

    expect(slotElement(container, "table", "scroller").tagName).toBe("SECTION");
  });
});
