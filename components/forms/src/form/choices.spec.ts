import { describe, expect, it } from "vitest";

import { collectionOf } from "#form/choices.ts";

const BELGIUM = { label: "Belgium", value: "be" };

const NETHERLANDS = { label: "Netherlands", value: "nl" };

describe("collectionOf", () => {
  it("lists the choices in the order given", () => {
    expect(collectionOf([BELGIUM, NETHERLANDS]).items).toStrictEqual([BELGIUM, NETHERLANDS]);
  });

  it("reads a row by its words", () => {
    expect(collectionOf([BELGIUM, NETHERLANDS]).stringifyItem(NETHERLANDS)).toBe("Netherlands");
  });

  it("keys a row by its value", () => {
    expect(collectionOf([BELGIUM, NETHERLANDS]).getItemValue(NETHERLANDS)).toBe("nl");
  });
});
