import { describe, expect, it } from "vitest";

import { changesOf } from "#data/changes.ts";
import { CREATED, UPDATED } from "#data/data.fixtures.tsx";

describe("changesOf", () => {
  it("names the record a variable states", () => {
    expect(changesOf([UPDATED], { id: "7" })).toStrictEqual([
      { action: "updated", id: "7", type: "time-off/request" },
    ]);
  });

  it("writes a numeric id as a string", () => {
    expect(changesOf([UPDATED], { id: 7 })).toStrictEqual([
      { action: "updated", id: "7", type: "time-off/request" },
    ]);
  });

  it("changes nothing where the variable is neither a string nor a number", () => {
    expect(changesOf([UPDATED], { id: null })).toStrictEqual([]);
  });

  it("changes nothing where the declaration names no variable", () => {
    expect(changesOf([{ action: "deleted", type: "time-off/request" }], { id: "7" })).toStrictEqual(
      [],
    );
  });

  it("names a created record with an empty id", () => {
    expect(changesOf([CREATED], {})).toStrictEqual([
      { action: "created", id: "", type: "time-off/request" },
    ]);
  });
});
