import { type ReactElement } from "react";

import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";
import { slotClass, slotElement } from "@stealthscale/testing-theme";

import { COLLECTION, type Row } from "#listbox/rows.fixtures.ts";
import { Simple, type SimpleProps } from "#listbox/simple.tsx";

/**
 * Renders a whole list named Places over the three-row collection.
 *
 * @param props - The props the case sets on the list.
 * @returns The list.
 */
function whole(props: Partial<SimpleProps<Row>> = {}): ReactElement {
  return <Simple<Row> aria-label="Places" collection={COLLECTION} mark="check" {...props} />;
}

/**
 * Returns the text of every rendered option.
 */
function rowsOf(): readonly string[] {
  return screen.getAllByRole("option").map((row) => row.textContent ?? "");
}

describe("Simple", () => {
  it("renders one option per collection item", async () => {
    await drawn(whole());

    expect(rowsOf()).toHaveLength(3);
  });

  it("names the list from label", async () => {
    await drawn(whole({ label: "Where a thing is filed" }));

    expect(screen.getByRole("listbox", { name: "Where a thing is filed" })).toBeTruthy();
  });

  it("names the list from aria-label without a label", async () => {
    await drawn(whole());

    expect(screen.getByRole("listbox", { name: "Places" })).toBeTruthy();
  });

  it("renders no label without the prop", async () => {
    const { container } = await drawn(whole());

    expect(container.querySelector("[class*=label]")).toBeNull();
  });

  it("renders no empty text while the collection has rows", async () => {
    await drawn(whole({ empty: "Nothing here." }));

    expect(screen.queryByText("Nothing here.")).toBeNull();
  });

  it("renders the description description returns", async () => {
    await drawn(whole({ description: (row) => `Held as ${row.value}` }));

    expect(screen.getByText("Held as invoices")).toBeTruthy();
  });

  it("renders the icon icon returns on every row", async () => {
    await drawn(whole({ icon: () => <span data-testid="kind">bank</span> }));

    expect(screen.getAllByTestId("kind")).toHaveLength(3);
  });

  it("renders one group per groupBy key", async () => {
    await drawn(whole({ groupBy: (row) => (row.value === "invoices" ? "owed" : "kept") }));

    expect(screen.getAllByRole("group")).toHaveLength(2);
  });

  it("orders the groups by first appearance", async () => {
    await drawn(whole({ groupBy: (row) => (row.value === "invoices" ? "owed" : "kept") }));

    expect(screen.getAllByRole("group").map((held) => held.textContent?.slice(0, 4))).toStrictEqual(
      ["owed", "kept"],
    );
  });

  it("renders the group label groupLabel returns", async () => {
    await drawn(
      whole({
        groupBy: () => "owed",
        groupLabel: (under) => `Group ${under}`,
      }),
    );

    expect(screen.getByText("Group owed")).toBeTruthy();
  });

  it("renders a field with narrowing", async () => {
    await drawn(whole({ narrowing: { onNarrow: vi.fn<(typed: string) => void>() } }));

    expect(screen.getByRole("textbox")).toBeTruthy();
  });

  it("calls onNarrow with the typed text", async () => {
    const narrowed = vi.fn<(typed: string) => void>();

    await drawn(whole({ narrowing: { onNarrow: narrowed } }));
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "inv" } });

    expect(narrowed).toHaveBeenCalledWith("inv");
  });

  it("selects every row on a press of the select-all row", async () => {
    await drawn(whole({ selectAll: "All places", selectionMode: "multiple" }));
    await pressed(screen.getByRole("button", { name: "All places" }));

    expect(screen.getAllByRole("option", { selected: true })).toHaveLength(3);
  });

  it("renders the value text with summary", async () => {
    const { container } = await drawn(whole({ summary: "Nothing picked" }));

    expect(slotElement(container, "listbox", "valueText")).toBeTruthy();
  });

  it("sets the content's height to tall rows", async () => {
    const { container } = await drawn(whole({ tall: 2 }));

    expect(slotElement(container, "listbox", "content").style.blockSize).toBe(
      "calc(var(--listbox-row) * 2)",
    );
  });

  it("applies the root's variant class to the frame", async () => {
    const { container } = await drawn(whole({ variant: "surface" }));

    expect([...slotElement(container, "listbox", "frame").classList].join(" ")).toContain(
      "surface",
    );
  });

  it("renders the field and the select-all row inside the frame", async () => {
    expect.hasAssertions();

    const { container } = await drawn(
      whole({
        narrowing: { onNarrow: vi.fn<(typed: string) => void>() },
        selectAll: "All",
        variant: "surface",
      }),
    );
    const frame = slotElement(container, "listbox", "frame");

    expect(frame.querySelector(`.${slotClass("listbox", "input")}`)).not.toBeNull();
    expect(frame.querySelector(`.${slotClass("listbox", "selectAll")}`)).not.toBeNull();
  });

  it("renders only rows inside the element with the listbox role", async () => {
    expect.hasAssertions();

    const { container } = await drawn(
      whole({
        empty: "Nothing here.",
        narrowing: { onNarrow: vi.fn<(typed: string) => void>() },
        selectAll: "All",
      }),
    );
    const held = slotElement(container, "listbox", "content");

    for (const part of ["empty", "input", "selectAll"]) {
      expect(held.querySelector(`.${slotClass("listbox", part)}`)).toBeNull();
    }
  });
});
