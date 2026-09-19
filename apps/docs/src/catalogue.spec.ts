import { describe, expect, it } from "vitest";

import { CATALOGUE, COMPILED, FRAME, INDEX, MOUNTED } from "#catalogue.ts";

describe("COMPILED", () => {
  it("hangs the catalogue under its route at its path inside the frame", () => {
    expect(COMPILED[0]).toMatchObject({ id: CATALOGUE, layout: [FRAME], path: MOUNTED });
  });

  it("names the index after the route", () => {
    expect(COMPILED[1]?.id).toBe(INDEX);
  });

  it("holds one page per specimen the build indexed", () => {
    expect(COMPILED.map((one) => one.id)).toContain("specimen.actions.button");
  });
});
