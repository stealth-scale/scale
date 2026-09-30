import { describe, expect, it } from "vitest";

import { traceMarkOf } from "#graph/marks.ts";

describe("marks", () => {
  it("marks an edge on the traced path", () => {
    expect(traceMarkOf(true)).toStrictEqual({ "data-trace": "on" });
  });

  it("marks an edge off the traced path", () => {
    expect(traceMarkOf(false)).toStrictEqual({ "data-trace": "off" });
  });
});
