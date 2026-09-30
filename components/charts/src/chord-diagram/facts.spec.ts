import { describe, expect, it } from "vitest";

import { type Readout, readoutOf } from "#chord-diagram/facts.ts";
import { type Mark, marksOf } from "#chord-diagram/marks.ts";

const MARKS = marksOf(
  [
    { key: "a", label: "Alpha" },
    { key: "b", label: "Beta" },
    { key: "c", label: "Gamma" },
  ],
  [
    { from: "a", to: "b", value: 60 },
    { from: "b", to: "a", value: 20 },
    { from: "a", to: "c", value: 20 },
    { from: "b", to: "b", value: 40 },
  ],
);

const WORDS = { inflow: "In", outflow: "Out" };

function readoutAt(walk: number): Readout {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- every case reads a place the marks have
  return readoutOf(MARKS[walk] as Mark, WORDS, (value) => `#${String(value)}`);
}

function textOf(node: unknown): string {
  return typeof node === "string" ? node : "";
}

function rowsOf(readout: Readout): string[] {
  return readout.rows.map((row) => `${textOf(row.name)} ${textOf(row.value)}`);
}

describe("readoutOf", () => {
  it("heads an arc's readout with its node's name", () => {
    expect(readoutAt(0).heading).toBe("Alpha");
  });

  it("writes what an arc's node sends and what it receives", () => {
    expect(rowsOf(readoutAt(0))).toStrictEqual(["Out #80", "In #20"]);
  });

  it("keeps the row of what a node that only receives sends", () => {
    expect(rowsOf(readoutAt(5))).toStrictEqual(["Out #0", "In #20"]);
  });

  it("heads a ribbon's readout with its two nodes' names", () => {
    expect(readoutAt(1).heading).toBe("Alpha ⇄ Beta");
  });

  it("writes both directions of a ribbon", () => {
    expect(rowsOf(readoutAt(1))).toStrictEqual(["Alpha → Beta #60", "Beta → Alpha #20"]);
  });

  it("keeps the row of a direction that sends nothing", () => {
    expect(rowsOf(readoutAt(2))).toStrictEqual(["Alpha → Gamma #20", "Gamma → Alpha #0"]);
  });

  it("heads a node's flow to itself with its name", () => {
    expect(readoutAt(4).heading).toBe("Beta");
  });

  it("writes a node's flow to itself as one row", () => {
    expect(rowsOf(readoutAt(4))).toStrictEqual(["Beta → Beta #40"]);
  });
});
