import { describe, expect, it } from "vitest";

import { entryOf } from "#catalogue/entry.ts";

function nothing(): null {
  return null;
}

function declaring(navigation: unknown): Parameters<typeof entryOf>[0] {
  return { component: nothing, id: "a", navigation, path: "a" };
}

describe("entryOf", () => {
  it("reads the words a declaration carries", () => {
    expect(entryOf(declaring({ label: "Button" }))?.label).toBe("Button");
  });

  it("reads the group a declaration carries", () => {
    expect(entryOf(declaring({ group: "Actions", label: "Button" }))?.group).toBe("Actions");
  });

  it("reads no group where the declaration names none", () => {
    expect(entryOf(declaring({ label: "Button" }))?.group).toBeUndefined();
  });

  it("reads the opening a declaration carries", () => {
    expect(entryOf(declaring({ about: "Presses.", label: "Button" }))?.about).toBe("Presses.");
  });

  it("reads no opening where the declaration carries none", () => {
    expect(entryOf(declaring({ label: "Button" }))?.about).toBeUndefined();
  });

  it("reads no group where the declaration names one that is not words", () => {
    expect(entryOf(declaring({ group: 1, label: "Button" }))?.group).toBeUndefined();
  });

  it("returns nothing for a declaration listed nowhere", () => {
    expect(entryOf({ component: nothing, id: "a", path: "a" })).toBeUndefined();
  });

  it("returns nothing where the entry is not an object", () => {
    expect(entryOf(declaring("Button"))).toBeUndefined();
  });

  it("returns nothing where the entry is null", () => {
    expect(entryOf(declaring(null))).toBeUndefined();
  });

  it("returns nothing where the entry states no words", () => {
    expect(entryOf(declaring({ group: "Actions" }))).toBeUndefined();
  });

  it("returns nothing where the words are not a string", () => {
    expect(entryOf(declaring({ label: 1 }))).toBeUndefined();
  });
});
