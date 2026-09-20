import { type ReactElement, type ReactNode } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { pressed, violations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Root } from "#listbox/root.tsx";
import { COLLECTION } from "#listbox/rows.fixtures.ts";
import { SelectAll } from "#listbox/select-all.tsx";

/**
 * Draws a part inside a list of several, which is the only kind the row belongs on.
 *
 * @param children - The part under test.
 * @returns The root, holding it.
 */
function several(children: ReactNode): ReactElement {
  return (
    <Root collection={COLLECTION} selectionMode="multiple">
      {children}
    </Root>
  );
}

describe("SelectAll", () => {
  it("draws a button inside the root it needs above it", () => {
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

  it("submits nothing, because a list of rows is not a form", () => {
    render(several(<SelectAll>All</SelectAll>));

    expect(screen.getByRole("button").getAttribute("type")).toBe("button");
  });

  it("reports the list as off while no row is picked", () => {
    render(several(<SelectAll>All</SelectAll>));

    expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe("false");
  });

  it("turns every row on when it is pressed", async () => {
    render(several(<SelectAll>All</SelectAll>));
    await pressed(screen.getByRole("button"));

    expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe("true");
  });

  it("clears every row when it is pressed a second time", async () => {
    render(several(<SelectAll>All</SelectAll>));
    await pressed(screen.getByRole("button"));
    await pressed(screen.getByRole("button"));

    expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe("false");
  });

  it("reports the list as part-way through while some of it is picked", () => {
    render(
      <Root collection={COLLECTION} defaultValue={["invoices"]} selectionMode="multiple">
        <SelectAll>All</SelectAll>
      </Root>,
    );

    expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe("mixed");
  });

  it("says how much of the list is on so a box inside it reads the same state", () => {
    const { container } = render(
      <Root collection={COLLECTION} defaultValue={["invoices"]} selectionMode="multiple">
        <SelectAll>All</SelectAll>
      </Root>,
    );

    expect(slotElement(container, "listbox", "selectAll").dataset["state"]).toBe("indeterminate");
  });

  it("draws no box of its own on a list whose rows carry none", () => {
    const { container } = render(several(<SelectAll>All</SelectAll>));

    expect(container.querySelector("[class*=itemCheckbox]")).toBeNull();
  });

  it("carries the same box as the rows beneath it on a boxed list", () => {
    const { container } = render(
      <Root boxed collection={COLLECTION} mark="check" mixedMark="dash" selectionMode="multiple">
        <SelectAll>All</SelectAll>
      </Root>,
    );

    expect(slotElement(container, "listbox", "itemCheckbox").textContent).toBe("check");
  });

  it("draws the part-checked mark while some of the list is on", () => {
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

  it("calls the handler a caller passed as well as turning the rows on", async () => {
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
