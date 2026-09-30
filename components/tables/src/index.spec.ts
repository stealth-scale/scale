import { describe, expect, it } from "vitest";

import * as tables from "#index.ts";

describe("index", () => {
  it("exports the DataTable kit and no other runtime name", () => {
    expect(Object.keys(tables)).toStrictEqual(["DataTable"]);
  });
});
