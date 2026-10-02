import { type ReactElement } from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { ListCollection } from "@zag-js/collection";
import { describe, expect, it } from "vitest";

import { drawn, pressed, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Input } from "#listbox/input.tsx";
import { offered } from "#listbox/listbox.fixtures.tsx";
import { Root } from "#listbox/root.tsx";
import { COLLECTION, type Row, ROWS } from "#listbox/rows.fixtures.ts";

/**
 * Collection of the one row a query for "rep" keeps.
 */
const REPORTS = new ListCollection<Row>({
  items: ROWS.filter((row) => row.value === "reports"),
  itemToString: (row): string => row.label,
  itemToValue: (row): string => row.value,
});

/**
 * Changes the field's value.
 */
function typed(value: string): void {
  fireEvent.change(screen.getByRole("textbox"), { target: { value } });
}

/**
 * Renders the field over a collection, highlighting the first row or not.
 */
function filtered(collection: ListCollection<Row>, autoHighlight: boolean): ReactElement {
  return (
    <Root collection={collection}>
      <Input aria-label="Filter places" autoHighlight={autoHighlight} />
    </Root>
  );
}

/**
 * Focuses the field over the three rows, then narrows the collection to one row.
 */
async function narrowed(autoHighlight: boolean): Promise<HTMLElement> {
  const { rerender } = await drawn(filtered(COLLECTION, autoHighlight));
  const field = screen.getByRole("textbox");

  field.focus();
  await settled();
  rerender(filtered(REPORTS, autoHighlight));
  await settled();

  return field;
}

describe("Input", () => {
  it("renders an input", () => {
    const { container } = render(offered(<Input aria-label="Filter places" />));

    expect(slotElement(container, "listbox", "input").tagName).toBe("INPUT");
  });

  it("renders the field inside the control div", () => {
    const { container } = render(offered(<Input aria-label="Filter places" />));

    expect(slotElement(container, "listbox", "control").tagName).toBe("DIV");
  });

  it("sets aria-haspopup to listbox", () => {
    render(offered(<Input aria-label="Filter places" />));

    expect(screen.getByRole("textbox").getAttribute("aria-haspopup")).toBe("listbox");
  });

  it("sets aria-controls", () => {
    render(offered(<Input aria-label="Filter places" />));

    expect(screen.getByRole("textbox").getAttribute("aria-controls")).toBeTruthy();
  });

  it("renders no clear control while the field is empty", () => {
    render(offered(<Input aria-label="Filter places" clearIndicator="x" />));

    expect(screen.queryByRole("button")).toBeNull();
  });

  it("renders no clear control without clearIndicator", async () => {
    await drawn(offered(<Input aria-label="Filter places" />));
    typed("pe");

    expect(screen.queryByRole("button")).toBeNull();
  });

  it("renders the clear control while the field has text", async () => {
    await drawn(offered(<Input aria-label="Filter places" clearIndicator="x" />));
    typed("pe");

    expect(screen.getByRole("button")).toBeTruthy();
  });

  it("names the clear control from clearLabel", async () => {
    await drawn(
      offered(<Input aria-label="Filter" clearIndicator="x" clearLabel="Clear the filter" />),
    );
    typed("pe");

    expect(screen.getByRole("button", { name: "Clear the filter" })).toBeTruthy();
  });

  it("clears the field on a press of the clear control", async () => {
    await drawn(offered(<Input aria-label="Filter places" clearIndicator="x" />));
    typed("pe");
    await pressed(screen.getByRole("button"));

    expect(screen.getByRole<HTMLInputElement>("textbox").value).toBe("");
  });

  it("focuses the field after a press of the clear control", async () => {
    await drawn(offered(<Input aria-label="Filter places" clearIndicator="x" />));
    typed("pe");
    await pressed(screen.getByRole("button"));

    expect(document.activeElement).toBe(screen.getByRole("textbox"));
  });

  it("calls onValueChange with the typed text", async () => {
    const heard: string[] = [];

    await drawn(
      offered(
        <Input
          aria-label="Filter places"
          onValueChange={(value) => {
            heard.push(value);
          }}
        />,
      ),
    );
    typed("pe");

    expect(heard).toStrictEqual(["pe"]);
  });

  it("renders the value of a controlled field", () => {
    render(offered(<Input aria-label="Filter places" value="quartz" />));

    expect(screen.getByRole<HTMLInputElement>("textbox").value).toBe("quartz");
  });

  it("highlights the first row of a narrowed collection with autoHighlight", async () => {
    const field = await narrowed(true);

    expect(field.getAttribute("aria-activedescendant")).toContain("reports");
  });

  it("highlights no row of a narrowed collection without autoHighlight", async () => {
    const field = await narrowed(false);

    expect(field.getAttribute("aria-activedescendant")).toBeNull();
  });
});
