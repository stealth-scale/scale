import { describe, expect, it } from "vitest";

import { WORDS, wordsOf } from "#sortable/words.ts";

const IN_LIST = { count: 3, item: "Write the spec", list: "To do", position: 2 };

const ALONE = { count: 5, item: "Draft", position: 1 };

describe("words", () => {
  it("announces a pick-up with the item's place in its list", () => {
    expect(WORDS.liftedLabel(IN_LIST)).toBe(
      "Picked up Write the spec at position 2 of 3 in To do.",
    );
  });

  it("announces a pick-up without a list for the one list of an array", () => {
    expect(WORDS.liftedLabel(ALONE)).toBe("Picked up Draft at position 1 of 5.");
  });

  it("announces a move with the place it offers", () => {
    expect(WORDS.movedLabel(IN_LIST)).toBe("Moved Write the spec to position 2 of 3 in To do.");
  });

  it("announces a drop with the place the item took", () => {
    expect(WORDS.droppedLabel(ALONE)).toBe("Dropped Draft at position 1 of 5.");
  });

  it("announces a cancel with the place the item went back to", () => {
    expect(WORDS.cancelledLabel(ALONE)).toBe("Put Draft back at position 1 of 5.");
  });

  it("announces a full list with its limit", () => {
    expect(WORDS.fullLabel({ item: "Draft", limit: 3, list: "In progress" })).toBe(
      "In progress is full at 3 items.",
    );
  });

  it("announces a refused move with the item and the list", () => {
    expect(WORDS.refusedLabel({ item: "Draft", list: "Done" })).toBe("Draft cannot move to Done.");
  });

  it("names a handle after its item", () => {
    expect(WORDS.handleLabel("Draft")).toBe("Move Draft");
  });

  it("describes a handle by the keys it takes", () => {
    expect(WORDS.instructions).toBe(
      "Press Space or Enter to pick the item up, the arrow keys to move it, Space or Enter to drop it and Escape to put it back.",
    );
  });

  it("sets the role description to sortable", () => {
    expect(WORDS.roleDescription).toBe("sortable");
  });

  it("applies the caller's words over the defaults", () => {
    expect(wordsOf({ roleDescription: "sortierbar" }).roleDescription).toBe("sortierbar");
  });

  it("keeps a default the caller leaves out", () => {
    expect(wordsOf({ handleLabel: undefined }).handleLabel).toBe(WORDS.handleLabel);
  });
});
