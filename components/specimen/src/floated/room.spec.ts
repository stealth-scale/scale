import { describe, expect, it } from "vitest";

import { NONE, roomFor, same } from "#floated/room.ts";

/**
 * A 100 by 40 box at the page's origin.
 */
const BOX = new DOMRect(0, 0, 100, 40);

describe("roomFor", () => {
  it("returns no padding without a positioner", () => {
    expect(roomFor(BOX, [], NONE)).toStrictEqual(NONE);
  });

  it("pads the block end by the depth a positioner extends below", () => {
    expect(roomFor(BOX, [new DOMRect(10, 44, 80, 60)], NONE)).toMatchObject({ blockEnd: 64 });
  });

  it("pads the block start by the height a positioner extends above", () => {
    expect(roomFor(BOX, [new DOMRect(10, -30, 80, 26)], NONE)).toMatchObject({ blockStart: 30 });
  });

  it("pads the inline start by the width a positioner extends left", () => {
    expect(roomFor(BOX, [new DOMRect(-50, 0, 46, 40)], NONE)).toMatchObject({ inlineStart: 50 });
  });

  it("pads the inline end by the width a positioner extends right", () => {
    expect(roomFor(BOX, [new DOMRect(104, 0, 46, 40)], NONE)).toMatchObject({ inlineEnd: 50 });
  });

  it("skips a positioner with no size", () => {
    expect(roomFor(BOX, [new DOMRect(0, 500, 0, 0)], NONE)).toStrictEqual(NONE);
  });

  it("keeps the padding a positioner already fits inside", () => {
    const padded = new DOMRect(0, 0, 100, 104);

    expect(roomFor(padded, [new DOMRect(10, 44, 80, 60)], { ...NONE, blockEnd: 64 })).toStrictEqual(
      { ...NONE, blockEnd: 64 },
    );
  });

  it("rounds the padding up to whole pixels", () => {
    expect(roomFor(BOX, [new DOMRect(10, 44, 80, 60.2)], NONE)).toMatchObject({ blockEnd: 65 });
  });
});

describe("same", () => {
  it("returns true for equal paddings", () => {
    expect(same(NONE, { ...NONE })).toBe(true);
  });

  it("returns false when one side differs", () => {
    expect(same(NONE, { ...NONE, inlineEnd: 1 })).toBe(false);
  });
});
