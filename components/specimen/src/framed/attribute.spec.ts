import { describe, expect, it } from "vitest";

import { FRAMED_ATTRIBUTE } from "#framed/attribute.ts";

describe("FRAMED_ATTRIBUTE", () => {
  it("is a data attribute", () => {
    expect(FRAMED_ATTRIBUTE).toBe("data-framed");
  });
});
