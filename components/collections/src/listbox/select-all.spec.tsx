import { type ReactElement, type ReactNode } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { pressed, violations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Root } from "#listbox/root.tsx";
import { COLLECTION } from "#listbox/rows.fixtures.ts";
import { SelectAll } from "#listbox/select-all.tsx";

/**
 * Renders the children inside a root in the multiple selection mode.
 *
 * @param children - The part under test.
 * @returns The root with the children inside it.
 */
function several(children: ReactNode): ReactElement {
  return (
    <Root collection={COLLECTION} selectionMode="multiple">
      {children}
    </Root>
  );
}

describe("SelectAll", () => {
  it("renders a button", () => {
    const { container } = render(several(<SelectAll>All</SelectAll>));

    expect(slotElement(container, "listbox", "selectAll").tagName).toBe("BUTTON");
  });

  it("conforms as a button element", () => {
    expect(
      violations(SelectAll, {
        as: true,
        children: true,
        element: "BUTTON",
        subject: (container) => slotElement(container, "listbox", "selectAll"),
        wrapper: several,
      }),
    ).toStrictEqual([]);
  });

  it("sets type button", () => {
    render(several(<SelectAll>All</SelectAll>));

    expect(screen.getByRole("button").getAttribute("type")).toBe("button");
  });

  it("sets aria-pressed to false while no row is selected", () => {
    render(several(<SelectAll>All</SelectAll>));

    expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe("false");
  });

  it("selects every row on a press", async () => {
    render(several(<SelectAll>All</SelectAll>));
    await pressed(screen.getByRole("button"));

    expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe("true");
  });

  it("clears the selection on a second press", async () => {
    render(several(<SelectAll>All</SelectAll>));
    await pressed(screen.getByRole("button"));
    await pressed(screen.getByRole("button"));

    expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe("false");
  });

  it("sets aria-pressed to mixed while part of the list is selected", () => {
    render(
      <Root collection={COLLECTION} defaultValue={["invoices"]} selectionMode="multiple">
        <SelectAll>All</SelectAll>
      </Root>,
    );

    expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe("mixed");
  });

  it("sets data-state to indeterminate while part of the list is selected", () => {
    const { container } = render(
      <Root collection={COLLECTION} defaultValue={["invoices"]} selectionMode="multiple">
        <SelectAll>All</SelectAll>
      </Root>,
    );

    expect(slotElement(container, "listbox", "selectAll").dataset["state"]).toBe("indeterminate");
  });

  it("renders no checkbox in a list without boxed", () => {
    const { container } = render(several(<SelectAll>All</SelectAll>));

    expect(container.querySelector("[class*=itemCheckbox]")).toBeNull();
  });

  it("renders the checkbox with the mark in a boxed list", () => {
    const { container } = render(
      <Root boxed collection={COLLECTION} mark="check" mixedMark="dash" selectionMode="multiple">
        <SelectAll>All</SelectAll>
      </Root>,
    );

    expect(slotElement(container, "listbox", "itemCheckbox").textContent).toBe("check");
  });

  it("renders the mixed mark while part of a boxed list is selected", () => {
    const { container } = render(
      <Root
        boxed
        collection={COLLECTION}
        defaultValue={["invoices"]}
        mark="check"
        mixedMark="dash"
        selectionMode="multiple"
      >
        <SelectAll>All</SelectAll>
      </Root>,
    );

    expect(slotElement(container, "listbox", "itemCheckbox").textContent).toBe("dash");
  });

  it("calls the caller's onClick on a press", async () => {
    let called = 0;

    render(
      several(
        <SelectAll
          onClick={() => {
            called += 1;
          }}
        >
          All
        </SelectAll>,
      ),
    );
    await pressed(screen.getByRole("button"));

    expect(called).toBe(1);
  });
});
