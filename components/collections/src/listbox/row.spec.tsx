import { type ReactElement, type ReactNode } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotElement, variantClass } from "@stealthscale/testing-theme";

import { Root, type RootProps } from "#listbox/root.tsx";
import { Row } from "#listbox/row.tsx";
import { COLLECTION, ROWS } from "#listbox/rows.fixtures.ts";

/**
 * Draws a row inside a list stating whatever shape a case wants.
 *
 * @param children - The row under test.
 * @param props - Whatever the case sets on the root.
 * @returns The root, holding it.
 */
function listed(children: ReactNode, props: Omit<RootProps, "collection"> = {}): ReactElement {
  return (
    <Root collection={COLLECTION} mark="check" {...props}>
      {children}
    </Root>
  );
}

describe("Row", () => {
  it("draws the words it is given", () => {
    render(listed(<Row item={ROWS[0]}>Invoices</Row>));

    expect(screen.getByRole("option", { name: /Invoices/u })).toBeTruthy();
  });

  it("holds the words and the line under them in one column", () => {
    const { container } = render(
      listed(
        <Row description="Settles nightly" item={ROWS[0]}>
          Invoices
        </Row>,
      ),
    );

    expect(slotElement(container, "listbox", "itemLines").textContent).toBe(
      "InvoicesSettles nightly",
    );
  });

  it("draws no line under the words where a caller writes none", () => {
    const { container } = render(listed(<Row item={ROWS[0]}>Invoices</Row>));

    expect(container.querySelector("[class*=itemDescription]")).toBeNull();
  });

  it("draws the mark at the end of a row while the list holds one row at a time", () => {
    const { container } = render(listed(<Row item={ROWS[0]}>Invoices</Row>));

    expect(slotElement(container, "listbox", "itemIndicator").textContent).toBe("check");
  });

  it("draws a box at the start of a row where the list says its set may hold several", () => {
    const { container } = render(listed(<Row item={ROWS[0]}>Invoices</Row>, { boxed: true }));

    expect(slotElement(container, "listbox", "itemCheckbox").textContent).toBe("check");
  });

  it("draws the check or the box, never both", () => {
    const { container } = render(listed(<Row item={ROWS[0]}>Invoices</Row>, { boxed: true }));

    expect(container.querySelector("[class*=itemIndicator]")).toBeNull();
  });

  it("draws the mark a caller puts before the words", () => {
    render(
      listed(
        <Row icon={<span data-testid="kind">bank</span>} item={ROWS[0]}>
          Invoices
        </Row>,
      ),
    );

    expect(screen.getByTestId("kind")).toBeTruthy();
  });

  it("leaves a boxed list's picked rows unfilled, because the box already says so", () => {
    const { container } = render(listed(<Row item={ROWS[0]}>Invoices</Row>, { boxed: true }));

    expect([...slotElement(container, "listbox", "item").classList]).toContain(
      variantClass(slotClass("listbox", "item"), "selected", "none"),
    );
  });

  it("fills a boxed list's picked rows where a caller asks for it", () => {
    const { container } = render(
      listed(<Row item={ROWS[0]}>Invoices</Row>, { boxed: true, selected: "solid" }),
    );

    expect([...slotElement(container, "listbox", "item").classList]).toContain(
      variantClass(slotClass("listbox", "item"), "selected", "solid"),
    );
  });
});
