import { describe, expect, expectTypeOf, it } from "vitest";

import { type Tone } from "#menu/tone.ts";

describe("Tone", () => {
  it("equals the literal critical", () => {
    expectTypeOf<Tone>().toEqualTypeOf<"critical">();

    expect(true).toBe(true);
  });

  it("rejects positive", () => {
    expectTypeOf<"positive">().not.toExtend<Tone>();

    expect(true).toBe(true);
  });
});
