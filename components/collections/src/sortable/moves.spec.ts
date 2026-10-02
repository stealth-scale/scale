import { describe, expect, it } from "vitest";

import {
  itemOf,
  listOf,
  placeOf,
  refusalOf,
  relocated,
  type SortableItem,
  type SortableRules,
} from "#sortable/moves.ts";
import { COLUMNS, STAGES } from "#sortable/sortable.fixtures.tsx";

const OPEN: SortableRules<SortableItem> = { limitOf: () => {} };

describe("moves", () => {
  it("returns an array itself as its one list", () => {
    expect(listOf(STAGES, "todo")).toBe(STAGES);
  });

  it("returns a record's list of the id", () => {
    expect(listOf(COLUMNS, "todo")).toBe(COLUMNS["todo"]);
  });

  it("returns no items for a list id the record lacks", () => {
    expect(listOf(COLUMNS, "later")).toStrictEqual([]);
  });

  it("returns no items of a record without a list id", () => {
    expect(listOf(COLUMNS)).toStrictEqual([]);
  });

  it("places an item of an array by its index alone", () => {
    expect(placeOf(STAGES, "review")).toStrictEqual({ index: 1 });
  });

  it("places an item of a record by its list and its index", () => {
    expect(placeOf(COLUMNS, "icons")).toStrictEqual({ index: 1, list: "todo" });
  });

  it("places no item an array lacks", () => {
    expect(placeOf(STAGES, "gone")).toBeUndefined();
  });

  it("places no item a record lacks", () => {
    expect(placeOf(COLUMNS, "gone")).toBeUndefined();
  });

  it("returns the item of an id in an array", () => {
    expect(itemOf(STAGES, "draft")).toBe(STAGES[0]);
  });

  it("returns the item of an id in a record", () => {
    expect(itemOf(COLUMNS, "api")).toBe(COLUMNS["doing"]?.[0]);
  });

  it("moves an item of an array down to the index of its place", () => {
    expect(relocated(STAGES, "draft", { index: 2 })?.items.map(({ id }) => id)).toStrictEqual([
      "review",
      "publish",
      "draft",
    ]);
  });

  it("reports the places an item of an array left and took", () => {
    const moved = relocated(STAGES, "publish", { index: 0 });

    expect([moved?.from, moved?.to]).toStrictEqual([{ index: 2 }, { index: 0 }]);
  });

  it("puts an item last for an index past the list's end", () => {
    expect(relocated(STAGES, "draft", { index: 9 })?.to).toStrictEqual({ index: 2 });
  });

  it("puts an item first for an index below zero", () => {
    expect(relocated(STAGES, "publish", { index: -1 })?.to).toStrictEqual({ index: 0 });
  });

  it("moves no item an array lacks", () => {
    expect(relocated(STAGES, "gone", { index: 0 })).toBeUndefined();
  });

  it("keeps an item in its own list for a place without a list", () => {
    expect(
      relocated(COLUMNS, "icons", { index: 0 })?.items["todo"]?.map(({ id }) => id),
    ).toStrictEqual(["icons", "spec"]);
  });

  it("moves an item into another list at the index of its place", () => {
    const moved = relocated(COLUMNS, "spec", { index: 0, list: "done" });

    expect([moved?.items["todo"]?.length, moved?.items["done"]?.map(({ id }) => id)]).toStrictEqual(
      [1, ["spec"]],
    );
  });

  it("reports the places an item of a record left and took", () => {
    const moved = relocated(COLUMNS, "api", { index: 5, list: "todo" });

    expect([moved?.from, moved?.to]).toStrictEqual([
      { index: 0, list: "doing" },
      { index: 2, list: "todo" },
    ]);
  });

  it("adds a list the record lacks for a place in it", () => {
    expect(relocated(COLUMNS, "api", { index: 0, list: "later" })?.items["later"]).toStrictEqual([
      { id: "api" },
    ]);
  });

  it("moves no item a record lacks", () => {
    expect(relocated(COLUMNS, "gone", { index: 0, list: "done" })).toBeUndefined();
  });

  it("refuses nothing for an item of an array", () => {
    expect(refusalOf(STAGES, "draft", { to: "todo" }, OPEN)).toBeUndefined();
  });

  it("refuses nothing within the list the item was picked up from", () => {
    expect(refusalOf(COLUMNS, "spec", { from: "todo", to: "todo" }, OPEN)).toBeUndefined();
  });

  it("refuses a list at its limit as full", () => {
    const rules: SortableRules<SortableItem> = {
      limitOf: (list) => (list === "doing" ? 1 : undefined),
    };

    expect(refusalOf(COLUMNS, "spec", { from: "todo", to: "doing" }, rules)).toBe("full");
  });

  it("counts no item against the limit of the list it is in", () => {
    const rules: SortableRules<SortableItem> = { limitOf: () => 1 };

    expect(refusalOf(COLUMNS, "api", { from: "todo", to: "doing" }, rules)).toBeUndefined();
  });

  it("refuses a move the caller's rule refuses", () => {
    const rules: SortableRules<SortableItem> = { ...OPEN, canMove: () => false };

    expect(refusalOf(COLUMNS, "spec", { from: "todo", to: "done" }, rules)).toBe("refused");
  });

  it("passes the caller's rule the item with the list it leaves and the list it enters", () => {
    const asked: unknown[] = [];
    const rules: SortableRules<SortableItem> = {
      ...OPEN,
      canMove: (item, from, to) => {
        asked.push([item, from, to]);

        return true;
      },
    };

    refusalOf(COLUMNS, "spec", { from: "todo", to: "done" }, rules);

    expect(asked).toStrictEqual([[{ id: "spec" }, "todo", "done"]]);
  });

  it("refuses nothing for an item no list contains", () => {
    const rules: SortableRules<SortableItem> = { ...OPEN, canMove: () => false };

    expect(refusalOf(COLUMNS, "gone", { from: "todo", to: "done" }, rules)).toBeUndefined();
  });
});
