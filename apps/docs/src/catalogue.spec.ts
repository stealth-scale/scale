import { describe, expect, it } from "vitest";

import { COMPILED, FRAME, FRAMED, INDEX } from "#catalogue.ts";

describe("COMPILED", () => {
  it("opens the index at the site root inside the frame", () => {
    expect(COMPILED[0]).toMatchObject({ id: INDEX, layout: [FRAME], path: "/" });
  });

  it("hangs the catalogue under no route of its own", () => {
    expect(COMPILED.map((one) => one.id)).not.toContain("docs.components");
  });

  it("serves the framed page at the root in no frame", () => {
    const framed = COMPILED.find((one) => one.id === "docs.framed");

    expect(framed).toMatchObject({ path: FRAMED });
    expect(framed).not.toHaveProperty("layout");
    expect(framed).not.toHaveProperty("parent");
  });

  it("holds one page per specimen the build indexed", () => {
    expect(COMPILED.map((one) => one.id)).toContain("specimen.components.actions.button");
  });

  it("stands an index at the address above a page", () => {
    const paths = COMPILED.map((one) => one.path);

    expect(paths).toContain("components");
    expect(paths).toContain("components/actions");
  });
});
