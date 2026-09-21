import { describe, expect, it } from "vitest";

import { declared } from "#catalogue/declared.ts";

const scene = { draw: (): null => null, title: "Sizes" };

describe("declared", () => {
  it("returns the page a module declares", () => {
    expect(declared({ default: { id: "data/badge", scenes: [scene] } })?.id).toBe("data/badge");
  });

  it("returns every scene the page lists", () => {
    const held = declared({ default: { id: "data/badge", scenes: [scene, scene] } });

    expect(held?.scenes).toHaveLength(2);
  });

  it("returns a page that lists no scene", () => {
    expect(declared({ default: { id: "empty", scenes: [] } })?.scenes).toStrictEqual([]);
  });

  it("returns the statement the page declares", () => {
    const stated = { id: "a", imports: 'import { Badge } from "@acme/kit";', scenes: [] };

    expect(declared({ default: stated })?.imports).toBe('import { Badge } from "@acme/kit";');
  });

  it("returns no statement where the page declares none", () => {
    expect(declared({ default: { id: "a", scenes: [] } })?.imports).toBeUndefined();
  });

  it("returns no statement where the page declares one that is not text", () => {
    expect(declared({ default: { id: "a", imports: 12, scenes: [] } })?.imports).toBeUndefined();
  });

  it("returns nothing for a module with no default export", () => {
    expect(declared({})).toBeUndefined();
  });

  it("returns nothing for a module that is not an object", () => {
    expect(declared("a specimen")).toBeUndefined();
  });

  it("returns nothing for a null module", () => {
    expect(declared(null)).toBeUndefined();
  });

  it("returns nothing where the default export is not an object", () => {
    expect(declared({ default: 1 })).toBeUndefined();
  });

  it("returns nothing where the default export is null", () => {
    expect(declared({ default: null })).toBeUndefined();
  });

  it("returns nothing where the page states no identifier", () => {
    expect(declared({ default: { scenes: [] } })).toBeUndefined();
  });

  it("returns nothing where the scenes are not a list", () => {
    expect(declared({ default: { id: "a", scenes: {} } })).toBeUndefined();
  });

  it("returns nothing where a scene draws nothing", () => {
    expect(declared({ default: { id: "a", scenes: [{ title: "Sizes" }] } })).toBeUndefined();
  });

  it("returns nothing where a scene states no title", () => {
    const drawn = { draw: (): null => null };

    expect(declared({ default: { id: "a", scenes: [drawn] } })).toBeUndefined();
  });

  it("returns nothing where a scene is not an object", () => {
    expect(declared({ default: { id: "a", scenes: ["Sizes"] } })).toBeUndefined();
  });

  it("returns nothing where a scene is null", () => {
    expect(declared({ default: { id: "a", scenes: [null] } })).toBeUndefined();
  });
});
