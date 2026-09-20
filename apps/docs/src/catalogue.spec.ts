import { describe, expect, it } from "vitest";

import { CATALOGUE, COMPILED, FRAME, FRAMED, INDEX, MOUNTED } from "#catalogue.ts";

describe("COMPILED", () => {
  it("hangs the catalogue under its route at its path inside the frame", () => {
    expect(COMPILED[0]).toMatchObject({ id: CATALOGUE, layout: [FRAME], path: MOUNTED });
  });

  it("serves the framed page at the root in no frame", () => {
    const framed = COMPILED.find((one) => one.id === "docs.framed");

    expect(framed).toMatchObject({ path: FRAMED });
    expect(framed).not.toHaveProperty("layout");
    expect(framed).not.toHaveProperty("parent");
  });

  it("names the index after the route", () => {
    expect(COMPILED[1]?.id).toBe(INDEX);
  });

  it("holds one page per specimen the build indexed", () => {
    expect(COMPILED.map((one) => one.id)).toContain("specimen.actions.button");
  });
});
