import { describe, expect, it } from "vitest";

import { outcomeOf } from "#sortable/moving.ts";
import { STAGES, stateOf } from "#sortable/sortable.fixtures.tsx";

describe("moving", () => {
  it("returns no outcome for an item no list contains", () => {
    expect(outcomeOf(stateOf(), "gone", { index: 0 })).toBeUndefined();
  });

  it("returns the refusal of a list at its limit without a move", () => {
    const outcome = outcomeOf(stateOf({ limits: { doing: 1 } }), "spec", {
      index: 0,
      list: "doing",
    });

    expect(outcome).toStrictEqual({ sentence: "In progress is full at 1 items." });
  });

  it("returns the items after the move", () => {
    const outcome = outcomeOf(stateOf({ items: STAGES }), "publish", { index: 0 });

    expect(
      Array.isArray(outcome?.items) ? outcome.items.map(({ id }) => id) : undefined,
    ).toStrictEqual(["publish", "draft", "review"]);
  });

  it("returns the move from the place the item left to the place it took", () => {
    expect(outcomeOf(stateOf(), "spec", { index: 0, list: "done" })?.move).toStrictEqual({
      from: { index: 0, list: "todo" },
      id: "spec",
      to: { index: 0, list: "done" },
    });
  });

  it("returns the sentence of the item's new place", () => {
    expect(outcomeOf(stateOf(), "spec", { index: 0, list: "done" })?.sentence).toBe(
      "Moved Write the spec to position 1 of 1 in Done.",
    );
  });
});
