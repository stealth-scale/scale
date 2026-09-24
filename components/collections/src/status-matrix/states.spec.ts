import { describe, expect, it } from "vitest";

import {
  indexed,
  type MatrixCell,
  type MatrixState,
  stateOf,
  worst,
} from "#status-matrix/states.ts";

/**
 * Vocabulary of five states, one per tone.
 */
const STATES: Readonly<Record<string, MatrixState>> = {
  down: { label: "Down", tone: "error" },
  fine: { label: "Healthy", tone: "success" },
  rolling: { label: "Rolling out", tone: "info" },
  skipped: { label: "Not applicable", tone: "neutral" },
  slow: { label: "Degraded", tone: "warning" },
};

/**
 * The index's result for a pair without a cell.
 */
const MISSING: MatrixCell | undefined = undefined;

/**
 * Returns a cell for a row, a column and a state.
 */
function cell(row: string, column: string, state: string): MatrixCell {
  return { column, row, state };
}

describe("indexed", () => {
  it("returns a cell by its row and its column", () => {
    const index = indexed([cell("a", "one", "fine")]);

    expect(index.get("a")?.get("one")).toStrictEqual(cell("a", "one", "fine"));
  });

  it("returns undefined for a pair without a cell", () => {
    const index = indexed([cell("a", "one", "fine")]);

    expect(index.get("a")?.get("two")).toBeUndefined();
  });

  it("returns undefined for a row without cells", () => {
    const index = indexed([cell("a", "one", "fine")]);

    expect(index.get("b")).toBeUndefined();
  });

  it("keeps the later of two cells for one pair", () => {
    const index = indexed([cell("a", "one", "fine"), cell("a", "one", "down")]);

    expect(index.get("a")?.get("one")?.state).toBe("down");
  });

  it("keys every row with a cell", () => {
    const index = indexed([cell("a", "one", "fine"), cell("b", "one", "down")]);

    expect([...index.keys()]).toStrictEqual(["a", "b"]);
  });
});

describe("stateOf", () => {
  it("returns the state a cell names", () => {
    expect(stateOf(STATES, cell("a", "one", "down"))).toStrictEqual(STATES["down"]);
  });

  it("returns undefined without a cell", () => {
    expect(stateOf(STATES, MISSING)).toBeUndefined();
  });

  it("returns undefined for a state outside the vocabulary", () => {
    expect(stateOf(STATES, cell("a", "one", "unheard"))).toBeUndefined();
  });
});

describe("worst", () => {
  it("returns the state of a one-crossing row", () => {
    expect(worst([STATES["fine"]])).toStrictEqual(STATES["fine"]);
  });

  it("ranks an error over every other tone", () => {
    expect(worst([STATES["fine"], STATES["down"], STATES["slow"]])).toStrictEqual(STATES["down"]);
  });

  it("ranks a warning over info", () => {
    expect(worst([STATES["rolling"], STATES["slow"]])).toStrictEqual(STATES["slow"]);
  });

  it("ranks a gap over a pass", () => {
    expect(worst([STATES["fine"], undefined])).toBeUndefined();
  });

  it("ranks a gap over neutral", () => {
    expect(worst([STATES["skipped"], undefined])).toBeUndefined();
  });

  it("ranks a gap under a warning", () => {
    expect(worst([undefined, STATES["slow"]])).toStrictEqual(STATES["slow"]);
  });

  it("ranks info over a pass", () => {
    expect(worst([STATES["fine"], STATES["rolling"]])).toStrictEqual(STATES["rolling"]);
  });

  it("ranks a pass over neutral", () => {
    expect(worst([STATES["skipped"], STATES["fine"]])).toStrictEqual(STATES["fine"]);
  });

  it("keeps the first of two states with one rank", () => {
    const first = { label: "First", tone: "success" } as const;
    const second = { label: "Second", tone: "success" } as const;

    expect(worst([first, second])).toStrictEqual(first);
  });

  it("returns undefined for an empty row", () => {
    expect(worst([])).toBeUndefined();
  });
});
