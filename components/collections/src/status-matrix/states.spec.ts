import { describe, expect, it } from "vitest";

import {
  indexed,
  type MatrixCell,
  type MatrixState,
  stateOf,
  worst,
} from "#status-matrix/states.ts";

/**
 * The vocabulary every case reads against.
 */
const STATES: Readonly<Record<string, MatrixState>> = {
  down: { label: "Down", tone: "error" },
  fine: { label: "Healthy", tone: "success" },
  rolling: { label: "Rolling out", tone: "info" },
  skipped: { label: "Not applicable", tone: "neutral" },
  slow: { label: "Degraded", tone: "warning" },
};

/**
 * Stands for a pair nobody measured, which is what the index returns for one.
 */
const MISSING: MatrixCell | undefined = undefined;

/**
 * Writes one crossing.
 */
function cell(row: string, column: string, state: string): MatrixCell {
  return { column, row, state };
}

describe("indexed", () => {
  it("finds a cell by its row and its column", () => {
    const index = indexed([cell("a", "one", "fine")]);

    expect(index.get("a")?.get("one")).toStrictEqual(cell("a", "one", "fine"));
  });

  it("finds nothing for a pair nobody measured", () => {
    const index = indexed([cell("a", "one", "fine")]);

    expect(index.get("a")?.get("two")).toBeUndefined();
  });

  it("finds nothing for a row nobody measured at all", () => {
    const index = indexed([cell("a", "one", "fine")]);

    expect(index.get("b")).toBeUndefined();
  });

  it("keeps the later of two cells written for one pair", () => {
    const index = indexed([cell("a", "one", "fine"), cell("a", "one", "down")]);

    expect(index.get("a")?.get("one")?.state).toBe("down");
  });

  it("holds every row a caller measured", () => {
    const index = indexed([cell("a", "one", "fine"), cell("b", "one", "down")]);

    expect([...index.keys()]).toStrictEqual(["a", "b"]);
  });
});

describe("stateOf", () => {
  it("reads the state a cell names", () => {
    expect(stateOf(STATES, cell("a", "one", "down"))).toStrictEqual(STATES["down"]);
  });

  it("reads nothing where there is no cell", () => {
    expect(stateOf(STATES, MISSING)).toBeUndefined();
  });

  it("reads a state outside the vocabulary as a gap", () => {
    expect(stateOf(STATES, cell("a", "one", "unheard"))).toBeUndefined();
  });
});

describe("worst", () => {
  it("returns the only state along a row of one", () => {
    expect(worst([STATES["fine"]])).toStrictEqual(STATES["fine"]);
  });

  it("ranks an error over everything else", () => {
    expect(worst([STATES["fine"], STATES["down"], STATES["slow"]])).toStrictEqual(STATES["down"]);
  });

  it("ranks a warning over anything under way", () => {
    expect(worst([STATES["rolling"], STATES["slow"]])).toStrictEqual(STATES["slow"]);
  });

  it("ranks a gap over a pass", () => {
    expect(worst([STATES["fine"], undefined])).toBeUndefined();
  });

  it("ranks a gap over a crossing that does not apply", () => {
    expect(worst([STATES["skipped"], undefined])).toBeUndefined();
  });

  it("ranks a gap under a warning", () => {
    expect(worst([undefined, STATES["slow"]])).toStrictEqual(STATES["slow"]);
  });

  it("ranks anything under way over a pass", () => {
    expect(worst([STATES["fine"], STATES["rolling"]])).toStrictEqual(STATES["rolling"]);
  });

  it("ranks a pass over a crossing that does not apply", () => {
    expect(worst([STATES["skipped"], STATES["fine"]])).toStrictEqual(STATES["fine"]);
  });

  it("keeps the first of two equals", () => {
    const first = { label: "First", tone: "success" } as const;
    const second = { label: "Second", tone: "success" } as const;

    expect(worst([first, second])).toStrictEqual(first);
  });

  it("reads a row of nothing at all as a gap", () => {
    expect(worst([])).toBeUndefined();
  });
});
