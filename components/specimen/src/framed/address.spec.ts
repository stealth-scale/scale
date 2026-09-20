import { describe, expect, it } from "vitest";

import { readAddress, writeAddress } from "#framed/address.ts";

describe("writeAddress", () => {
  it("writes the page and the scene and each position of the pick", () => {
    expect(writeAddress({ page: "actions/button", pick: { across: 2, value: 1 }, scene: 0 })).toBe(
      "#actions/button/0?v=1&x=2",
    );
  });

  it("writes a board's sample by its position", () => {
    expect(writeAddress({ page: "layout/grid", pick: { sample: 3 }, scene: 4 })).toBe(
      "#layout/grid/4?s=3",
    );
  });

  it("writes no query for the whole scene", () => {
    expect(writeAddress({ page: "layout/grid", pick: {}, scene: 4 })).toBe("#layout/grid/4");
  });
});

describe("readAddress", () => {
  it("reads back what was written", () => {
    const address = { page: "actions/button", pick: { across: 2, value: 1 }, scene: 0 };

    expect(readAddress(writeAddress(address))).toStrictEqual(address);
  });

  it("reads a fragment with or without its hash", () => {
    expect(readAddress("layout/grid/4?s=3")).toStrictEqual({
      page: "layout/grid",
      pick: { sample: 3 },
      scene: 4,
    });
  });

  it("answers nothing for a fragment that names no page or no scene", () => {
    expect(readAddress("")).toBeUndefined();
    expect(readAddress("#actions/button")).toBeUndefined();
    expect(readAddress("#/0")).toBeUndefined();
  });

  it("leaves out a position that is not a whole number", () => {
    expect(readAddress("#actions/button/0?v=one&x=-1&s=2")).toStrictEqual({
      page: "actions/button",
      pick: { sample: 2 },
      scene: 0,
    });
  });
});
