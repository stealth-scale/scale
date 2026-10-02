import { describe, expect, it } from "vitest";

import { chordLayout, type ChordRibbon, type ChordSpan } from "#chord-diagram/layout.ts";
import { type SankeyFlow } from "#sankey-chart/flows.ts";

const TAU = Math.PI * 2;

const NODES = [{ key: "a" }, { key: "b" }, { key: "c" }];

/**
 * Lists a pair with flows both ways, a sending more than it receives, and a flow one way to c.
 */
const FLOWS: readonly SankeyFlow[] = [
  { from: "a", to: "b", value: 60 },
  { from: "b", to: "a", value: 20 },
  { from: "a", to: "c", value: 20 },
];

function spanOf(span: ChordSpan | undefined): number {
  return (span?.endAngle ?? Number.NaN) - (span?.startAngle ?? Number.NaN);
}

function arcOf(groups: readonly ChordSpan[], key: string): ChordSpan | undefined {
  return groups.find((group) => group.key === key);
}

function ribbonOf(
  ribbons: readonly ChordRibbon[],
  from: string,
  to: string,
): ChordRibbon | undefined {
  return ribbons.find((ribbon) => ribbon.source.key === from && ribbon.target.key === to);
}

describe("chordLayout", () => {
  it("tiles the circle with the arcs and the spaces between them", () => {
    const { groups } = chordLayout(NODES, FLOWS, 0.05);

    expect(groups.reduce((sum, group) => sum + spanOf(group), 0) + 0.05 * 3).toBeCloseTo(TAU, 10);
  });

  it("makes each arc as long as what its node sends", () => {
    const { groups } = chordLayout(NODES, FLOWS);

    expect(spanOf(arcOf(groups, "a")) / spanOf(arcOf(groups, "b"))).toBeCloseTo(4, 10);
  });

  it("writes what each arc's node sends as its value", () => {
    expect(chordLayout(NODES, FLOWS).groups.map((group) => group.value)).toStrictEqual([80, 20, 0]);
  });

  it("gives a node that only receives an arc of no length", () => {
    expect(spanOf(arcOf(chordLayout(NODES, FLOWS).groups, "c"))).toBe(0);
  });

  it("starts the first arc at 12 o'clock", () => {
    expect(chordLayout(NODES, FLOWS).groups[0]?.startAngle).toBe(0);
  });

  it("puts the default space of 0.06 between an arc and the next", () => {
    const { groups } = chordLayout(NODES, FLOWS);

    expect((groups[1]?.startAngle ?? 0) - (groups[0]?.endAngle ?? 0)).toBeCloseTo(0.06, 10);
  });

  it("lays one ribbon for a pair with flows both ways", () => {
    const ribbon = ribbonOf(chordLayout(NODES, FLOWS).ribbons, "a", "b");

    expect([ribbon?.source.value, ribbon?.target.value]).toStrictEqual([60, 20]);
  });

  it("makes each end of a ribbon as wide as what its node sends to the other", () => {
    const ribbon = ribbonOf(chordLayout(NODES, FLOWS).ribbons, "a", "b");

    expect(spanOf(ribbon?.source) / spanOf(ribbon?.target)).toBeCloseTo(3, 10);
  });

  it("ends a ribbon that flows one way in a foot of no width", () => {
    const ribbon = ribbonOf(chordLayout(NODES, FLOWS).ribbons, "a", "c");

    expect([ribbon?.target.value, spanOf(ribbon?.target)]).toStrictEqual([0, 0]);
  });

  it("keeps every end of a ribbon inside its node's arc", () => {
    const { groups, ribbons } = chordLayout(NODES, FLOWS);
    const ends = ribbons.flatMap((ribbon) => [ribbon.source, ribbon.target]);

    expect(
      ends.every((end) => {
        const arc = arcOf(groups, end.key);

        return (
          arc !== undefined &&
          end.startAngle >= arc.startAngle - 1e-9 &&
          end.endAngle <= arc.endAngle + 1e-9
        );
      }),
    ).toBe(true);
  });

  it("lays a node's feet in the nodes' order", () => {
    const { ribbons } = chordLayout(NODES, FLOWS);

    expect([
      ribbonOf(ribbons, "a", "b")?.source.startAngle,
      ribbonOf(ribbons, "a", "c")?.source.startAngle,
    ]).toStrictEqual([0, ribbonOf(ribbons, "a", "b")?.source.endAngle]);
  });

  it("lays a node's flow to itself as a ribbon whose two ends are one foot", () => {
    const ribbon = ribbonOf(
      chordLayout(NODES, [...FLOWS, { from: "b", to: "b", value: 40 }]).ribbons,
      "b",
      "b",
    );

    expect([ribbon?.source.key, ribbon?.target === ribbon?.source]).toStrictEqual(["b", true]);
  });

  it("makes the foot of a node's flow to itself as wide as the flow", () => {
    const ribbon = ribbonOf(
      chordLayout(NODES, [...FLOWS, { from: "b", to: "b", value: 40 }]).ribbons,
      "b",
      "b",
    );

    expect(ribbon?.source.value).toBe(40);
  });

  it("adds up the flows between the same two nodes", () => {
    const { ribbons } = chordLayout(NODES, [
      { from: "a", to: "b", value: 10 },
      { from: "a", to: "b", value: 15 },
    ]);

    expect(ribbons.map((ribbon) => ribbon.source.value)).toStrictEqual([25]);
  });

  it("orders the ribbons by their source's arc then by their target's", () => {
    const { ribbons } = chordLayout(NODES, [
      { from: "c", to: "b", value: 5 },
      ...FLOWS,
      { from: "c", to: "c", value: 5 },
    ]);

    expect(ribbons.map((ribbon) => `${ribbon.source.key}${ribbon.target.key}`)).toStrictEqual([
      "ab",
      "ac",
      "bc",
      "cc",
    ]);
  });

  it("leaves out a flow to a node it does not know", () => {
    const { groups } = chordLayout(NODES, [...FLOWS, { from: "a", to: "nope", value: 500 }], 0.05);

    expect(groups.reduce((sum, group) => sum + spanOf(group), 0) + 0.05 * 3).toBeCloseTo(TAU, 10);
  });

  it("leaves out a flow from a node it does not know", () => {
    const { groups } = chordLayout(NODES, [...FLOWS, { from: "nope", to: "a", value: 500 }], 0.05);

    expect(groups.reduce((sum, group) => sum + spanOf(group), 0) + 0.05 * 3).toBeCloseTo(TAU, 10);
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY, -5, 0])(
    "leaves out a flow whose value is %s",
    (value) => {
      const { groups } = chordLayout(NODES, [...FLOWS, { from: "a", to: "b", value }]);

      expect(arcOf(groups, "a")?.value).toBe(80);
    },
  );

  it("leaves out a node no counted flow touches", () => {
    expect(
      chordLayout([...NODES, { key: "d" }], FLOWS).groups.map((group) => group.key),
    ).toStrictEqual(["a", "b", "c"]);
  });

  it("keeps the place of the first of two nodes with one key", () => {
    expect(
      chordLayout([{ key: "b" }, { key: "a" }, { key: "b" }], FLOWS).groups.map(
        (group) => group.key,
      ),
    ).toStrictEqual(["b", "a"]);
  });

  it("returns no arcs and no ribbons without nodes", () => {
    expect(chordLayout([], FLOWS)).toStrictEqual({ groups: [], ribbons: [] });
  });

  it("returns no arcs and no ribbons without a counted flow", () => {
    expect(chordLayout(NODES, [{ from: "a", to: "b", value: 0 }])).toStrictEqual({
      groups: [],
      ribbons: [],
    });
  });

  it("caps the spaces between the arcs at half the circle", () => {
    const crowd = Array.from({ length: 80 }, (_, at) => ({ key: `e${String(at)}` }));
    const { groups } = chordLayout(
      crowd,
      crowd.slice(1).map((node) => ({ from: "e0", to: node.key, value: 1 })),
      0.5,
    );

    expect(groups.reduce((sum, group) => sum + spanOf(group), 0)).toBeCloseTo(Math.PI, 10);
  });
});
