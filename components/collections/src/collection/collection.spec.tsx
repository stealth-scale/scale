import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { pressed } from "@stealthscale/testing-react";

import { type CollectionOptions, useListCollection } from "#collection/collection.ts";

/**
 * Describes one row the specification narrows.
 */
interface Row {
  /**
   * Words that should find the row beyond its own.
   */
  keywords?: string | undefined;

  /**
   * The words the row is drawn by.
   */
  label: string;
}

/**
 * The rows every case starts from.
 */
const ROWS: readonly Row[] = [
  { label: "Invoices" },
  { keywords: "add create", label: "New document" },
  { label: "Settings" },
];

/**
 * Reads a collection and reports what is left of it, with a control that narrows it.
 *
 * @param props - What to narrow to, and how to match a row.
 * @returns The rows left, drawn as text.
 */
function Reader(
  props: { to: string } & Omit<CollectionOptions<Row>, "itemToString" | "itemToValue" | "rows">,
): ReactElement {
  const { to, ...rest } = props;
  const { collection, narrow } = useListCollection<Row>({
    ...rest,
    itemToString: (row) => row.label,
    itemToValue: (row) => row.label,
    rows: ROWS,
  });

  return (
    <>
      <button
        onClick={() => {
          narrow(to);
        }}
        type="button"
      >
        Narrow
      </button>
      <span data-testid="left">{collection.items.map((row) => row.label).join(",")}</span>
      <span data-testid="off">
        {collection.items
          .filter((row) => collection.getItemDisabled(row))
          .map((row) => row.label)
          .join(",")}
      </span>
    </>
  );
}

describe("useListCollection", () => {
  it("holds every row before anything is typed", () => {
    render(<Reader to="" />);

    expect(screen.getByTestId("left").textContent).toBe("Invoices,New document,Settings");
  });

  it("keeps the rows whose words hold what was typed", async () => {
    render(<Reader to="inv" />);
    await pressed(screen.getByRole("button"));

    expect(screen.getByTestId("left").textContent).toBe("Invoices");
  });

  it("keeps the order the rows were given", async () => {
    render(<Reader to="s" />);
    await pressed(screen.getByRole("button"));

    expect(screen.getByTestId("left").textContent).toBe("Invoices,Settings");
  });

  it("restores every row where the typed text is cleared", async () => {
    render(<Reader to="" />);
    await pressed(screen.getByRole("button"));

    expect(screen.getByTestId("left").textContent).toBe("Invoices,New document,Settings");
  });

  it("holds no row off until a caller says which", () => {
    render(<Reader to="" />);

    expect(screen.getByTestId("off").textContent).toBe("");
  });

  it("carries the rows a caller holds off through to the collection", () => {
    render(<Reader isItemDisabled={(row) => row.label === "Settings"} to="" />);

    expect(screen.getByTestId("off").textContent).toBe("Settings");
  });

  it("matches on more than a row's own words where a caller says how", async () => {
    render(
      <Reader
        filter={(words, typed, row) =>
          words.includes(typed) || (row.keywords ?? "").includes(typed)
        }
        to="add"
      />,
    );
    await pressed(screen.getByRole("button"));

    expect(screen.getByTestId("left").textContent).toBe("New document");
  });
});
