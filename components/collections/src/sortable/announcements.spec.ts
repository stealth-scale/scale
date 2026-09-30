import { describe, expect, it } from "vitest";

import {
  announcementsOf,
  endSentence,
  listIdOf,
  nameOf,
  originOf,
  overSentence,
  placeWords,
  refusedAt,
  refusedSentence,
  sourceOf,
  targetPlaceOf,
} from "#sortable/announcements.ts";
import { COLUMNS, sourceWith, STAGES, stateOf, targetWith } from "#sortable/sortable.fixtures.tsx";

const SPEC = sourceOf(sourceWith({ group: "todo", id: "spec", index: 0 }));

const REFUSING = stateOf({ canMove: () => false });

describe("announcements", () => {
  it("writes a list's id as a string", () => {
    expect(listIdOf(4)).toBe("4");
  });

  it("writes no list id for the one list of an array", () => {
    expect(listIdOf()).toBeUndefined();
  });

  it("places an item target by its index and its list", () => {
    expect(
      targetPlaceOf(COLUMNS, "spec", targetWith({ group: "doing", id: "api", index: 0 })),
    ).toStrictEqual({
      index: 0,
      list: "doing",
    });
  });

  it("places an item target without an index first", () => {
    expect(targetPlaceOf(STAGES, "draft", targetWith({ id: "review" }))).toStrictEqual({
      index: 0,
      list: undefined,
    });
  });

  it("places a list target after the list's other items", () => {
    expect(targetPlaceOf(COLUMNS, "icons", targetWith({ id: "todo", type: "list" }))).toStrictEqual(
      {
        index: 1,
        list: "todo",
      },
    );
  });

  it("returns the origin the drag's start recorded", () => {
    const state = stateOf({ snapshot: { items: COLUMNS, origin: { index: 1, list: "todo" } } });

    expect(originOf(state, SPEC)).toStrictEqual({ index: 1, list: "todo" });
  });

  it("returns the origin the sortable reports without a record", () => {
    const source = sourceOf(
      sourceWith({ group: "doing", id: "spec", initialGroup: "todo", initialIndex: 0 }),
    );

    expect(originOf(stateOf(), source)).toStrictEqual({ index: 0, list: "todo" });
  });

  it("refuses no place without a list", () => {
    expect(refusedAt(REFUSING, "spec", "todo", { index: 0 })).toBeUndefined();
  });

  it("refuses no place for no target", () => {
    expect(refusedAt(REFUSING, "spec", "todo")).toBeUndefined();
  });

  it("returns the list that refuses the item and why", () => {
    expect(refusedAt(REFUSING, "spec", "todo", { index: 0, list: "done" })).toStrictEqual([
      "done",
      "refused",
    ]);
  });

  it("names an item by its registered name", () => {
    expect(nameOf(stateOf(), "spec")).toBe("Write the spec");
  });

  it("names an item without a registered name by its id", () => {
    expect(nameOf(stateOf(), "later")).toBe("later");
  });

  it("writes a full list's sentence with its name and its limit", () => {
    expect(refusedSentence(stateOf({ limits: { doing: 1 } }), "spec", ["doing", "full"])).toBe(
      "In progress is full at 1 items.",
    );
  });

  it("writes a refused move's sentence with the item and the list", () => {
    expect(refusedSentence(stateOf(), "spec", ["done", "refused"])).toBe(
      "Write the spec cannot move to Done.",
    );
  });

  it("names a list without a registered name by its id", () => {
    expect(refusedSentence(stateOf(), "spec", ["later", "refused"])).toBe(
      "Write the spec cannot move to later.",
    );
  });

  it("counts the item in the list it would take", () => {
    expect(placeWords(stateOf(), "spec", { index: 0, list: "done" })).toStrictEqual({
      count: 1,
      item: "Write the spec",
      list: "Done",
      position: 1,
    });
  });

  it("names no list for the one list of an array", () => {
    expect(placeWords(stateOf({ items: STAGES }), "review", { index: 1 })).toStrictEqual({
      count: 3,
      item: "Review",
      list: undefined,
      position: 2,
    });
  });

  it("returns no sentence while the drag is over no target", () => {
    expect(overSentence(stateOf(), SPEC, null)).toBeUndefined();
  });

  it("returns no sentence while the drag is over the item itself", () => {
    expect(
      overSentence(stateOf(), SPEC, targetWith({ group: "todo", id: "spec", index: 0 })),
    ).toBeUndefined();
  });

  it("announces the place a target offers", () => {
    expect(
      overSentence(stateOf(), SPEC, targetWith({ group: "todo", id: "icons", index: 1 })),
    ).toBe("Moved Write the spec to position 2 of 2 in To do.");
  });

  it("announces a target list that refuses the item", () => {
    expect(overSentence(REFUSING, SPEC, targetWith({ id: "done", type: "list" }))).toBe(
      "Write the spec cannot move to Done.",
    );
  });

  it("announces a drop with the place the item took", () => {
    const source = sourceOf(
      sourceWith({ group: "doing", id: "spec", index: 1, initialGroup: "todo" }),
    );

    expect(
      endSentence(stateOf(), source, targetWith({ group: "doing", id: "spec", index: 1 }), false),
    ).toBe("Dropped Write the spec at position 2 of 2 in In progress.");
  });

  it("announces a cancel with the place the item was picked up from", () => {
    expect(endSentence(stateOf(), SPEC, null, true)).toBe(
      "Put Write the spec back at position 1 of 2 in To do.",
    );
  });

  it("announces a drop on a full list as the item going back", () => {
    const state = stateOf({ limits: { doing: 1 } });

    expect(endSentence(state, SPEC, targetWith({ id: "doing", type: "list" }), false)).toBe(
      "Put Write the spec back at position 1 of 2 in To do.",
    );
  });

  it("announces a drop the rule refuses with the rule's refusal", () => {
    expect(endSentence(REFUSING, SPEC, targetWith({ id: "done", type: "list" }), false)).toBe(
      "Write the spec cannot move to Done.",
    );
  });

  it("announces a pick-up with the item's place", () => {
    const { dragstart } = announcementsOf(() => stateOf());

    expect(
      dragstart({ operation: { source: sourceWith({ group: "todo", id: "icons", index: 1 }) } }),
    ).toBe("Picked up Design the icons at position 2 of 2 in To do.");
  });

  it("announces a target through the plugin's dragover", () => {
    const { dragover } = announcementsOf(() => stateOf());
    const source = sourceWith({ group: "todo", id: "spec", index: 0 });

    expect(
      dragover({ operation: { source, target: targetWith({ id: "done", type: "list" }) } }),
    ).toBe("Moved Write the spec to position 1 of 1 in Done.");
  });

  it("announces a drag's end through the plugin's dragend", () => {
    const { dragend } = announcementsOf(() => stateOf());
    const source = sourceWith({ group: "todo", id: "spec", index: 0 });

    expect(dragend({ canceled: true, operation: { source, target: null } })).toBe(
      "Put Write the spec back at position 1 of 2 in To do.",
    );
  });
});
