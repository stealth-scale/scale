import { describe, expect, it } from "vitest";

import { type Entry, type Refused, type Source } from "#contract.ts";
import { headingOf, isRefused, read } from "#read.ts";

function file(declared: string, path = "/src/badge/badge.specimen.tsx"): Source {
  return {
    path,
    text: `import { specimen } from "somewhere";\n\nexport default specimen(${declared});\n`,
  };
}

function page(held: Source): Entry {
  const [one] = read([held]);

  if (one === undefined || isRefused(one)) throw new Error("expected a page");

  return one;
}

function refusal(held: Source): Refused {
  const [one] = read([held]);

  if (one === undefined || !isRefused(one)) throw new Error("expected a refusal");

  return one;
}

describe("read", () => {
  it("returns every field a page states", () => {
    const held = page(
      file(
        `{ about: "A word.", group: "Feedback", id: "feedback/badge", namespace: "data", title: "Badge", scenes: [] }`,
      ),
    );

    expect(held).toStrictEqual({
      about: "A word.",
      group: "Feedback",
      id: "feedback/badge",
      namespace: "data",
      path: "/src/badge/badge.specimen.tsx",
      title: "Badge",
    });
  });

  it("returns an empty group when the page states none", () => {
    expect(page(file(`{ id: "feedback/badge", scenes: [] }`)).group).toBe("");
  });

  it("returns an empty namespace when the page states none", () => {
    expect(page(file(`{ id: "feedback/badge", scenes: [] }`)).namespace).toBe("");
  });

  it("returns an empty opening when the page states none", () => {
    expect(page(file(`{ id: "feedback/badge", scenes: [] }`)).about).toBe("");
  });

  it("names a page after the last part of its identifier when it states no title", () => {
    expect(page(file(`{ id: "feedback/badge", scenes: [] }`)).title).toBe("Badge");
  });

  it("reads a hyphenated name as words", () => {
    expect(page(file(`{ id: "overlays/hover-card", scenes: [] }`)).title).toBe("Hover card");
  });

  it("keeps the path the file was read from", () => {
    expect(page(file(`{ id: "a/b", scenes: [] }`, "/elsewhere/a.specimen.tsx")).path).toBe(
      "/elsewhere/a.specimen.tsx",
    );
  });

  it("returns one answer per file in the order the files were given", () => {
    const held = read([
      file(`{ id: "b", scenes: [] }`, "/b.specimen.tsx"),
      file(`{ id: "a", scenes: [] }`, "/a.specimen.tsx"),
    ]);

    expect(held.map((one) => (isRefused(one) ? one.wrong : one.id))).toStrictEqual(["b", "a"]);
  });

  it("omits the scenes from the page it returns", () => {
    const held = page(file(`{ id: "a", scenes: [{ draw: () => null, title: "One" }] }`));

    expect(held).not.toHaveProperty("scenes");
  });

  it("looks through satisfies to the object under it", () => {
    expect(page(file(`{ id: "feedback/badge", scenes: [] } satisfies Specimen`)).id).toBe(
      "feedback/badge",
    );
  });

  it("looks through as const to the object under it", () => {
    expect(page(file(`{ id: "feedback/badge", scenes: [] } as const`)).id).toBe("feedback/badge");
  });

  it("reads a field stated under a quoted name", () => {
    expect(page(file(`{ "id": "feedback/badge", scenes: [] }`)).id).toBe("feedback/badge");
  });

  it("reads an identifier declared after a spread", () => {
    expect(page(file(`{ ...shared, id: "feedback/badge", scenes: [] }`)).id).toBe("feedback/badge");
  });

  it("parses a ts specimen without reading its angle brackets as jsx", () => {
    const held = page({
      path: "/a.specimen.ts",
      text: `const same = <Held>(held: Held): Held => held;\nexport default specimen({ id: "a" });\n`,
    });

    expect(held.id).toBe("a");
  });

  it("refuses a computed key rather than reading the name it is computed from", () => {
    expect(refusal(file(`{ [id]: "feedback/badge", scenes: [] }`)).wrong).toMatch(/id/u);
  });

  it("refuses a default export that is not a call", () => {
    expect(
      refusal({ path: "/a.specimen.tsx", text: `export default { id: "a" };\n` }),
    ).toStrictEqual({
      path: "/a.specimen.tsx",
      wrong: "states a default export that is not a call",
    });
  });

  it("refuses a file with no default export", () => {
    expect(refusal({ path: "/a.specimen.tsx", text: `export const a = 1;\n` }).wrong).toMatch(
      /default export/u,
    );
  });

  it("refuses a call taking something other than an object", () => {
    expect(refusal(file(`"feedback/badge"`)).wrong).toMatch(/object/u);
  });

  it("refuses a call taking more than one argument", () => {
    expect(refusal(file(`{ id: "a", scenes: [] }, extra`)).wrong).toMatch(/object/u);
  });

  it("refuses a page stating no identifier", () => {
    expect(refusal(file(`{ title: "Badge", scenes: [] }`)).wrong).toMatch(/id/u);
  });

  it("refuses an identifier the source does not hold as a literal", () => {
    expect(refusal(file(`{ id: idFor("badge"), scenes: [] }`)).wrong).toMatch(/id/u);
  });

  it("refuses the second of two pages at one address and names the first", () => {
    const [, second] = read([
      file(`{ id: "feedback/badge", scenes: [] }`, "/one.specimen.tsx"),
      file(`{ id: "feedback/badge", scenes: [] }`, "/two.specimen.tsx"),
    ]);

    expect(second).toStrictEqual({
      path: "/two.specimen.tsx",
      wrong: "states the id feedback/badge, which /one.specimen.tsx states too",
    });
  });

  it("says what it could not parse when the source is not a program", () => {
    expect(refusal({ path: "/a.specimen.tsx", text: `export default specimen(` }).wrong).toMatch(
      /parsed/u,
    );
  });

  it("keeps reading after a file it refused", () => {
    const held = read([
      file(`{ id: "a", scenes: [] }`, "/a.specimen.tsx"),
      { path: "/b.specimen.tsx", text: "export default 1;\n" },
      file(`{ id: "c", scenes: [] }`, "/c.specimen.tsx"),
    ]);

    expect(held.map((one) => isRefused(one))).toStrictEqual([false, true, false]);
  });

  it("capitalises a single word when it turns an identifier into a heading", () => {
    expect(headingOf("badge")).toBe("Badge");
  });

  it("returns an empty string when it turns an empty name into a heading", () => {
    expect(headingOf("")).toBe("");
  });

  it("returns true when the answer carries a reason rather than a page", () => {
    expect(isRefused({ path: "/a.specimen.tsx", wrong: "states no default export" })).toBe(true);
  });

  it("leaves out a field the source does not hold as a string literal", () => {
    const [held] = read([file(`{ id: "a", scenes: [], count: 2, title: "A" }`)]);

    expect(held).toStrictEqual({
      about: "",
      group: "",
      id: "a",
      namespace: "",
      path: "/src/badge/badge.specimen.tsx",
      title: "A",
    });
  });
});
