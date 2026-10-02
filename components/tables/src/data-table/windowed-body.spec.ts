import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";

import { EXPANDING, PINNING, tabled } from "#data-table/data-table.fixtures.tsx";
import {
  boxed,
  centerBodyOf,
  entriesOf,
  laidOut,
  linesIn,
  observer,
  scrolledTo,
  viewportOf,
} from "#data-table/windowed.fixtures.ts";

describe("WindowedBody", () => {
  it("returns no accessibility violation for a windowed table", async () => {
    observer();
    laidOut();

    await expect(
      accessibilityViolations(() => tabled({ data: entriesOf(30) }, { windowed: true })),
    ).resolves.toStrictEqual([]);
  });

  it("renders the lines in view and the overscan", () => {
    observer();
    laidOut();
    const { container } = render(tabled({ data: entriesOf(100) }, { windowed: true }));

    expect(linesIn(container)).toHaveLength(18);
  });

  it("reserves the height of the lines after them in a spacer", () => {
    observer();
    laidOut();
    const { container } = render(tabled({ data: entriesOf(100) }, { windowed: true }));
    const spacer = centerBodyOf(container).lastElementChild as HTMLElement | null;

    expect(spacer?.style.getPropertyValue("--spacer-size")).toBe("3280px");
  });

  it("hides a spacer from assistive technology", () => {
    observer();
    laidOut();
    const { container } = render(tabled({ data: entriesOf(100) }, { windowed: true }));

    expect(centerBodyOf(container).lastElementChild?.getAttribute("aria-hidden")).toBe("true");
  });

  it("states each line's aria-rowindex after the header row", () => {
    observer();
    laidOut();
    const { container } = render(tabled({ data: entriesOf(100) }, { windowed: true }));

    expect(linesIn(container)[0]?.getAttribute("aria-rowindex")).toBe("2");
  });

  it("states each line's key", () => {
    observer();
    laidOut();
    const { container } = render(tabled({ data: entriesOf(100) }, { windowed: true }));

    expect(linesIn(container)[0]?.dataset["key"]).toBe("record:Entry 001");
  });

  it("renders the lines at the scroll position", async () => {
    observer();
    laidOut();
    const { container } = render(tabled({ data: entriesOf(100) }, { windowed: true }));

    await scrolledTo(viewportOf(container), 2000);

    expect(linesIn(container)[0]?.dataset["index"]).toBe("42");
  });

  it("renders a line at the position among its group's rows its index gives", async () => {
    observer();
    laidOut();
    const { container } = render(tabled({ data: entriesOf(100) }, { windowed: true }));

    await scrolledTo(viewportOf(container), 2000);
    const first = linesIn(container)[0];

    expect([...centerBodyOf(container).children].findIndex((row) => row === first)).toBe(2);
  });

  it("keeps the line that contains focus rendered after a scroll", async () => {
    observer();
    laidOut();
    const { container } = render(
      tabled({ columns: PINNING, data: entriesOf(100) }, { windowed: true }),
    );
    const toggle = screen.getByRole("button", { name: "Pin Entry 003" });

    act(() => {
      toggle.focus();
    });
    await scrolledTo(viewportOf(container), 2000);

    expect(linesIn(container)[0]?.dataset["index"]).toBe("2");
  });

  it("keeps focus on a control of the kept line after a scroll", async () => {
    observer();
    laidOut();
    const { container } = render(
      tabled({ columns: PINNING, data: entriesOf(100) }, { windowed: true }),
    );
    const toggle = screen.getByRole("button", { name: "Pin Entry 003" });

    act(() => {
      toggle.focus();
    });
    await scrolledTo(viewportOf(container), 2000);

    expect(document.activeElement).toBe(toggle);
  });

  it("calls onEndReached once the last row comes within the overscan", async () => {
    observer();
    laidOut();
    const onEndReached = vi.fn<() => void>();
    const { container } = render(
      tabled({ data: entriesOf(100) }, { onEndReached, windowed: true }),
    );

    await scrolledTo(viewportOf(container), 3600);

    expect(onEndReached.mock.calls).toStrictEqual([[]]);
  });

  it("renders the empty row with its row index while the table has no rows", () => {
    observer();
    laidOut();
    render(tabled({ data: [] }, { windowed: true }));

    expect(
      screen.getByRole("cell", { name: "No rows" }).closest("tr")?.getAttribute("aria-rowindex"),
    ).toBe("2");
  });

  it("renders the rows pinned to the top in a row group of their own", () => {
    observer();
    laidOut();
    const { container } = render(
      tabled(
        { data: entriesOf(100), initialState: { rowPinning: { bottom: [], top: ["Entry 005"] } } },
        { windowed: true },
      ),
    );
    const rows = container.querySelectorAll("tbody[data-pinned=top] tr");

    expect([rows.length, rows[0]?.getAttribute("aria-rowindex")]).toStrictEqual([1, "2"]);
  });

  it("numbers the windowed rows after the rows pinned to the top", () => {
    observer();
    laidOut();
    const { container } = render(
      tabled(
        { data: entriesOf(100), initialState: { rowPinning: { bottom: [], top: ["Entry 005"] } } },
        { windowed: true },
      ),
    );

    expect(linesIn(container)[0]?.getAttribute("aria-rowindex")).toBe("3");
  });

  it("marks the last row pinned to the top data-region-end", () => {
    observer();
    laidOut();
    const { container } = render(
      tabled(
        { data: entriesOf(100), initialState: { rowPinning: { bottom: [], top: ["Entry 005"] } } },
        { windowed: true },
      ),
    );

    expect(
      container.querySelector<HTMLElement>("tbody[data-pinned=top] tr")?.dataset["regionEnd"],
    ).toBe("");
  });

  it("renders the rows pinned to the bottom after the windowed rows", () => {
    observer();
    laidOut();
    const { container } = render(
      tabled(
        { data: entriesOf(100), initialState: { rowPinning: { bottom: ["Entry 001"], top: [] } } },
        { windowed: true },
      ),
    );
    const bottom = container.querySelector<HTMLElement>("table > tbody:last-of-type");

    expect([
      bottom?.dataset["pinned"],
      bottom?.querySelector("tr")?.getAttribute("aria-rowindex"),
    ]).toStrictEqual(["bottom", "101"]);
  });

  it("marks the last windowed row data-region-end while rows are pinned to the bottom", () => {
    observer();
    laidOut();
    const { container } = render(
      tabled(
        { data: entriesOf(10), initialState: { rowPinning: { bottom: ["Entry 001"], top: [] } } },
        { windowed: true },
      ),
    );

    expect(linesIn(container).at(-1)?.dataset["regionEnd"]).toBe("");
  });

  it("writes the header's height on the group pinned to the top", () => {
    const resized = observer();

    laidOut();
    boxed({ thead: new DOMRect(0, 0, 400, 40) });
    const { container } = render(
      tabled(
        { data: entriesOf(100), initialState: { rowPinning: { bottom: [], top: ["Entry 005"] } } },
        { windowed: true },
      ),
    );

    resized();

    expect(
      container
        .querySelector<HTMLElement>("tbody[data-pinned=top]")
        ?.style.getPropertyValue("--table-head-size"),
    ).toBe("40px");
  });

  it("writes no header height on the group pinned to the top while the header does not stick", () => {
    const resized = observer();

    laidOut();
    boxed({ thead: new DOMRect(0, 0, 400, 40) });
    const { container } = render(
      tabled(
        { data: entriesOf(100), initialState: { rowPinning: { bottom: [], top: ["Entry 005"] } } },
        { stickyHeader: false, windowed: true },
      ),
    );

    resized();

    expect(
      container
        .querySelector<HTMLElement>("tbody[data-pinned=top]")
        ?.style.getPropertyValue("--table-head-size"),
    ).toBe("0px");
  });

  it("renders an expanded row's detail as a line of its own", () => {
    observer();
    laidOut();
    const { container } = render(
      tabled(
        {
          columns: EXPANDING,
          data: entriesOf(100),
          initialState: { expanded: { "Entry 002": true } },
        },
        { windowed: true },
      ),
    );

    expect(container.querySelector<HTMLElement>('tr[data-index="2"]')?.dataset["key"]).toBe(
      "detail:Entry 002",
    );
  });

  it("renders a pinned row's detail in the row's group without a region of its own", () => {
    observer();
    laidOut();
    const { container } = render(
      tabled(
        {
          columns: EXPANDING,
          data: entriesOf(100),
          initialState: {
            expanded: { "Entry 005": true },
            rowPinning: { bottom: [], top: ["Entry 005"] },
          },
        },
        { windowed: true },
      ),
    );
    const rows = [...container.querySelectorAll<HTMLElement>("tbody[data-pinned=top] tr")];

    expect(rows.map((row) => row.dataset["pinned"] ?? "detail")).toStrictEqual(["top", "detail"]);
  });

  it("renders a grid's row out of view to focus its cell on Control with End", () => {
    observer();
    laidOut();
    render(tabled({ data: entriesOf(100) }, { grid: true, windowed: true }));
    const first = document.querySelector<HTMLElement>(
      '[data-row="Entry 001"][data-column="account"]',
    );

    act(() => {
      first?.focus();
    });
    fireEvent.keyDown(document.activeElement ?? document.body, { ctrlKey: true, key: "End" });

    expect((document.activeElement as HTMLElement | null)?.dataset["row"]).toBe("Entry 100");
  });

  it("moves focus to a row's pin toggle in the group the row moves to", () => {
    observer();
    laidOut();
    render(tabled({ columns: PINNING, data: entriesOf(100) }, { windowed: true }));

    act(() => {
      screen.getByRole("button", { name: "Pin Entry 003" }).click();
    });

    expect(document.activeElement?.closest("tbody")?.dataset["pinned"]).toBe("top");
  });
});
