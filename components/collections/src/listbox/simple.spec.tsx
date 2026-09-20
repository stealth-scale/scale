import { type ReactElement } from "react";

import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { COLLECTION, type Row } from "#listbox/rows.fixtures.ts";
import { Simple, type SimpleProps } from "#listbox/simple.tsx";

/**
 * Draws a whole list, less whatever a case states itself.
 *
 * @param props - Whatever the case sets on the list.
 * @returns The list.
 */
function whole(props: Partial<SimpleProps<Row>> = {}): ReactElement {
  return <Simple<Row> aria-label="Places" collection={COLLECTION} mark="check" {...props} />;
}

/**
 * Names the rows the list drew.
 */
function rowsOf(): readonly string[] {
  return screen.getAllByRole("option").map((row) => row.textContent ?? "");
}

describe("Simple", () => {
  it("draws one row per row of the collection", async () => {
    await drawn(whole());

    expect(rowsOf()).toHaveLength(3);
  });

  it("names the list from the words above it", async () => {
    await drawn(whole({ label: "Where a thing is filed" }));

    expect(screen.getByRole("listbox", { name: "Where a thing is filed" })).toBeTruthy();
  });

  it("names the rows themselves where a caller gives no words above them", async () => {
    await drawn(whole());

    expect(screen.getByRole("listbox", { name: "Places" })).toBeTruthy();
  });

  it("draws no label where a caller writes none", async () => {
    const { container } = await drawn(whole());

    expect(container.querySelector("[class*=label]")).toBeNull();
  });

  it("says nothing about an empty list while the list holds rows", async () => {
    await drawn(whole({ empty: "Nothing here." }));

    expect(screen.queryByText("Nothing here.")).toBeNull();
  });

  it("writes a line under a row's name where a caller reads one off the row", async () => {
    await drawn(whole({ description: (row) => `Held as ${row.value}` }));

    expect(screen.getByText("Held as invoices")).toBeTruthy();
  });

  it("draws a mark before a row's name where a caller reads one off the row", async () => {
    await drawn(whole({ icon: () => <span data-testid="kind">bank</span> }));

    expect(screen.getAllByTestId("kind")).toHaveLength(3);
  });

  it("gathers the rows under headings where a caller says how", async () => {
    await drawn(whole({ groupBy: (row) => (row.value === "invoices" ? "owed" : "kept") }));

    expect(screen.getAllByRole("group")).toHaveLength(2);
  });

  it("keeps the headings in the order they first appear", async () => {
    await drawn(whole({ groupBy: (row) => (row.value === "invoices" ? "owed" : "kept") }));

    expect(screen.getAllByRole("group").map((held) => held.textContent?.slice(0, 4))).toStrictEqual(
      ["owed", "kept"],
    );
  });

  it("names a heading with the words a caller reads off its key", async () => {
    await drawn(
      whole({
        groupBy: () => "owed",
        groupLabel: (under) => `Group ${under}`,
      }),
    );

    expect(screen.getByText("Group owed")).toBeTruthy();
  });

  it("draws a field above the rows where a caller asks to narrow them", async () => {
    await drawn(whole({ narrowing: { onNarrow: vi.fn<(typed: string) => void>() } }));

    expect(screen.getByRole("textbox")).toBeTruthy();
  });

  it("reports what was typed, so a caller hands back the rows that are left", async () => {
    const narrowed = vi.fn<(typed: string) => void>();

    await drawn(whole({ narrowing: { onNarrow: narrowed } }));
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "inv" } });

    expect(narrowed).toHaveBeenCalledWith("inv");
  });

  it("draws a row above the rest that turns the whole list on", async () => {
    await drawn(whole({ selectAll: "All places", selectionMode: "multiple" }));
    await pressed(screen.getByRole("button", { name: "All places" }));

    expect(screen.getAllByRole("option", { selected: true })).toHaveLength(3);
  });

  it("writes what is picked under the list where a caller asks for it", async () => {
    const { container } = await drawn(whole({ summary: "Nothing picked" }));

    expect(slotElement(container, "listbox", "valueText")).toBeTruthy();
  });

  it("holds the list to the rows it is told to stand, and draws only what is near", async () => {
    const { container } = await drawn(whole({ tall: 2 }));

    expect(slotElement(container, "listbox", "content").style.blockSize).toBe(
      "calc(var(--listbox-row) * 2)",
    );
  });

  it("takes every variant its root takes", async () => {
    const { container } = await drawn(whole({ variant: "surface" }));

    expect([...slotElement(container, "listbox", "content").classList].join(" ")).toContain(
      "surface",
    );
  });
});
