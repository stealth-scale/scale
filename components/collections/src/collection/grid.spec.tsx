import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { type GridOptions, useGridCollection } from "#collection/grid.ts";

/**
 * The tiles every case crosses.
 */
const TILES = ["one", "two", "three", "four", "five", "six"];

/**
 * Builds a grid and reports one reading of it off the screen.
 *
 * @param props - The count of columns, and what to read back.
 * @returns The reading, as text.
 */
function Reader(
  props: { read: (grid: ReturnType<typeof useGridCollection<string>>) => string } & Pick<
    GridOptions<string>,
    "columnCount"
  >,
): ReactElement {
  const { columnCount, read } = props;
  const grid = useGridCollection({
    columnCount,
    itemToString: (tile) => tile,
    itemToValue: (tile) => tile,
    rows: TILES,
  });

  return <span data-testid="read">{read(grid)}</span>;
}

describe("useGridCollection", () => {
  it("lays the tiles out in the count of columns it is given", () => {
    render(<Reader columnCount={3} read={(grid) => String(grid.collection.getRowCount())} />);

    expect(screen.getByTestId("read").textContent).toBe("2");
  });

  it("keeps the tiles in the order they were given", () => {
    render(
      <Reader
        columnCount={3}
        read={(grid) =>
          grid.collection
            .getRows()
            .map((held) => held.join(" "))
            .join(" / ")
        }
      />,
    );

    expect(screen.getByTestId("read").textContent).toBe("one two three / four five six");
  });

  it("knows which tile sits under another, which is what the arrows ask it", () => {
    render(
      <Reader columnCount={3} read={(grid) => grid.collection.getNextRowValue("two") ?? ""} />,
    );

    expect(screen.getByTestId("read").textContent).toBe("five");
  });

  it("lays the same tiles out again when the count of columns changes", () => {
    const { rerender } = render(
      <Reader columnCount={3} read={(grid) => String(grid.collection.getRowCount())} />,
    );

    rerender(<Reader columnCount={2} read={(grid) => String(grid.collection.getRowCount())} />);

    expect(screen.getByTestId("read").textContent).toBe("3");
  });
});
