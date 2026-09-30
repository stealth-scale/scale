import { describe, expect, it } from "vitest";

import { type Mark, marksOf, traceOf } from "#chord-diagram/marks.ts";
import { type SankeyFlow, type SankeyNode } from "#sankey-chart/flows.ts";

const NODES: readonly SankeyNode[] = [
  { color: "teal", key: "a", label: "Alpha" },
  { key: "b", label: "Beta" },
  { key: "c" },
];

/**
 * Lists a pair with flows both ways, a sending more than it receives, and a flow one way to c.
 */
const FLOWS: readonly SankeyFlow[] = [
  { from: "a", to: "b", value: 60 },
  { from: "b", to: "a", value: 20 },
  { from: "a", to: "c", value: 20 },
];

function labelOf(mark: Mark | undefined): string {
  if (mark === undefined) return "none";

  return mark.kind === "arc"
    ? `arc ${mark.group.key}`
    : `ribbon ${mark.ribbon.source.key}${mark.ribbon.target.key}`;
}

function markAt(marks: readonly Mark[], label: string): Mark | undefined {
  return marks.find((mark) => labelOf(mark) === label);
}

const MARKS = marksOf(NODES, FLOWS);

describe("marks", () => {
  it("visits each arc then the ribbons whose source end is on it", () => {
    expect(marksOf(NODES, FLOWS).map((mark) => labelOf(mark))).toStrictEqual([
      "arc a",
      "ribbon ab",
      "ribbon ac",
      "arc b",
      "arc c",
    ]);
  });

  it("numbers each mark by its place in the walk", () => {
    expect(marksOf(NODES, FLOWS).map((mark) => mark.walk)).toStrictEqual([0, 1, 2, 3, 4]);
  });

  it("gives a ribbon the color of the source's node when it sends more", () => {
    const ribbon = markAt(marksOf(NODES, FLOWS), "ribbon ab");

    expect(ribbon?.kind === "ribbon" ? ribbon.dominant : undefined).toBe("a");
  });

  it("gives a ribbon the color of the target's node when it sends more", () => {
    const ribbon = markAt(
      marksOf(NODES, [
        { from: "a", to: "b", value: 20 },
        { from: "b", to: "a", value: 60 },
      ]),
      "ribbon ab",
    );

    expect(ribbon?.kind === "ribbon" ? ribbon.dominant : undefined).toBe("b");
  });

  it("gives a ribbon the color of the source's node when both send as much", () => {
    const ribbon = markAt(
      marksOf(NODES, [
        { from: "a", to: "b", value: 20 },
        { from: "b", to: "a", value: 20 },
      ]),
      "ribbon ab",
    );

    expect(ribbon?.kind === "ribbon" ? ribbon.dominant : undefined).toBe("a");
  });

  it("names each arc by its node's label or else its key", () => {
    expect(
      marksOf(NODES, FLOWS).flatMap((mark) => (mark.kind === "arc" ? [mark.title] : [])),
    ).toStrictEqual(["Alpha", "Beta", "c"]);
  });

  it("names a ribbon's two nodes", () => {
    const ribbon = markAt(marksOf(NODES, FLOWS), "ribbon ab");

    expect(ribbon?.kind === "ribbon" ? ribbon.titles : undefined).toStrictEqual(["Alpha", "Beta"]);
  });

  it("writes what flows into each arc's node", () => {
    expect(
      marksOf(NODES, FLOWS).flatMap((mark) => (mark.kind === "arc" ? [mark.inflow] : [])),
    ).toStrictEqual([20, 60, 20]);
  });

  it("gives an arc the palette its node states", () => {
    expect(
      marksOf(NODES, FLOWS).flatMap((mark) => (mark.kind === "arc" ? [mark.color] : [])),
    ).toStrictEqual(["teal", undefined, undefined]);
  });

  it("leaves out a node no counted flow touches", () => {
    expect(marksOf([...NODES, { key: "d" }], FLOWS).some((mark) => labelOf(mark) === "arc d")).toBe(
      false,
    );
  });

  it("takes the name and palette of the first of two nodes with one key", () => {
    const [arc] = marksOf([...NODES, { color: "pink", key: "a", label: "Second" }], FLOWS);

    expect(arc?.kind === "arc" ? [arc.title, arc.color] : undefined).toStrictEqual([
      "Alpha",
      "teal",
    ]);
  });

  it("returns no marks without a counted flow", () => {
    expect(marksOf(NODES, [])).toStrictEqual([]);
  });

  it("leaves every mark without a trace while the readout is at no mark", () => {
    expect(MARKS.map((mark) => traceOf(mark))).toStrictEqual([
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ]);
  });

  it("dims every other arc while the readout is at an arc", () => {
    const active = markAt(MARKS, "arc b");

    expect(
      MARKS.flatMap((mark) => (mark.kind === "arc" ? [traceOf(mark, active)] : [])),
    ).toStrictEqual(["dimmed", undefined, "dimmed"]);
  });

  it("dims every arc while the readout is at a ribbon", () => {
    const active = markAt(MARKS, "ribbon ab");

    expect(
      MARKS.flatMap((mark) => (mark.kind === "arc" ? [traceOf(mark, active)] : [])),
    ).toStrictEqual(["dimmed", "dimmed", "dimmed"]);
  });

  it("lights the ribbon the readout is at", () => {
    const active = markAt(MARKS, "ribbon ac");

    expect(
      MARKS.flatMap((mark) => (mark.kind === "ribbon" ? [traceOf(mark, active)] : [])),
    ).toStrictEqual(["dimmed", "lit"]);
  });

  it("lights the ribbons that end on the node whose arc the readout is at", () => {
    const active = markAt(MARKS, "arc c");

    expect(
      MARKS.flatMap((mark) => (mark.kind === "ribbon" ? [traceOf(mark, active)] : [])),
    ).toStrictEqual(["dimmed", "lit"]);
  });

  it("lights the ribbons that start on the node whose arc the readout is at", () => {
    const active = markAt(MARKS, "arc a");

    expect(
      MARKS.flatMap((mark) => (mark.kind === "ribbon" ? [traceOf(mark, active)] : [])),
    ).toStrictEqual(["lit", "lit"]);
  });
});
