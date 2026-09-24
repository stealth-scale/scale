import { type ReactElement, type ReactNode } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotElement, variantClass } from "@stealthscale/testing-theme";

import { Root, type RootProps } from "#listbox/root.tsx";
import { Row } from "#listbox/row.tsx";
import { COLLECTION, ROWS } from "#listbox/rows.fixtures.ts";

/**
 * Renders a row inside a root with the mark `check`.
 *
 * @param children - The row under test.
 * @param props - The props of the root.
 * @returns The root with the row inside it.
 */
function listed(children: ReactNode, props: Omit<RootProps, "collection"> = {}): ReactElement {
  return (
    <Root collection={COLLECTION} mark="check" {...props}>
      {children}
    </Root>
  );
}

describe("Row", () => {
  it("names the option from its children", () => {
    render(listed(<Row item={ROWS[0]}>Invoices</Row>));

    expect(screen.getByRole("option", { name: /Invoices/u })).toBeTruthy();
  });

  it("renders the text and the description in the lines part", () => {
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

  it("renders no description without the prop", () => {
    const { container } = render(listed(<Row item={ROWS[0]}>Invoices</Row>));

    expect(container.querySelector("[class*=itemDescription]")).toBeNull();
  });

  it("renders the mark at the row's end in a list without boxed", () => {
    const { container } = render(listed(<Row item={ROWS[0]}>Invoices</Row>));

    expect(slotElement(container, "listbox", "itemIndicator").textContent).toBe("check");
  });

  it("renders the mark in a checkbox at the row's start in a boxed list", () => {
    const { container } = render(listed(<Row item={ROWS[0]}>Invoices</Row>, { boxed: true }));

    expect(slotElement(container, "listbox", "itemCheckbox").textContent).toBe("check");
  });

  it("renders no end mark in a boxed list", () => {
    const { container } = render(listed(<Row item={ROWS[0]}>Invoices</Row>, { boxed: true }));

    expect(container.querySelector("[class*=itemIndicator]")).toBeNull();
  });

  it("renders the icon it is given", () => {
    render(
      listed(
        <Row icon={<span data-testid="kind">bank</span>} item={ROWS[0]}>
          Invoices
        </Row>,
      ),
    );

    expect(screen.getByTestId("kind")).toBeTruthy();
  });

  it("defaults selected to none in a boxed list", () => {
    const { container } = render(listed(<Row item={ROWS[0]}>Invoices</Row>, { boxed: true }));

    expect([...slotElement(container, "listbox", "item").classList]).toContain(
      variantClass(slotClass("listbox", "item"), "selected", "none"),
    );
  });

  it("applies the selected fill a boxed list states", () => {
    const { container } = render(
      listed(<Row item={ROWS[0]}>Invoices</Row>, { boxed: true, selected: "solid" }),
    );

    expect([...slotElement(container, "listbox", "item").classList]).toContain(
      variantClass(slotClass("listbox", "item"), "selected", "solid"),
    );
  });
});
