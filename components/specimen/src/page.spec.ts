import { describe, expect, it } from "vitest";

import { scene, type Scene, sourceOf, specimen } from "#page.ts";

const SIZES: Scene = { draw: () => null, title: "Sizes" };

describe("page", () => {
  it("returns the page it was given", () => {
    const page = { group: "Actions", id: "actions/button", scenes: [SIZES] };

    expect(specimen(page)).toStrictEqual(page);
  });

  it("returns the scene it was given", () => {
    expect(scene(SIZES)).toStrictEqual(SIZES);
  });

  it("keeps the scenes in the order the page lists them", () => {
    const states: Scene = { draw: () => null, title: "States" };
    const page = specimen({ id: "actions/button", scenes: [states, SIZES] });

    expect(page.scenes.map((held) => held.title)).toStrictEqual(["States", "Sizes"]);
  });

  it("returns the source a scene states", () => {
    expect(sourceOf({ ...SIZES, source: "<Badge />" })).toBe("<Badge />");
  });

  it("returns the source export of the example module when the scene states no source", () => {
    expect(sourceOf({ ...SIZES, example: { source: "<Tag.Root />" } })).toBe("<Tag.Root />");
  });

  it("prefers the stated source over the example module", () => {
    expect(sourceOf({ ...SIZES, example: { source: "<Tag.Root />" }, source: "<Badge />" })).toBe(
      "<Badge />",
    );
  });

  it("returns undefined when the example module has no string source export", () => {
    expect(sourceOf({ ...SIZES, example: { source: 1 } })).toBeUndefined();
  });

  it("writes the props of a hand-written scene into the example spreads", () => {
    const example = { source: "function A(props: P) {\n  return <B {...props} />;\n}" };

    expect(sourceOf({ ...SIZES, example, props: { disabled: true } })).toBe(
      "function A() {\n  return <B disabled />;\n}",
    );
  });

  it("returns undefined when the scene states neither source nor example", () => {
    expect(sourceOf(SIZES)).toBeUndefined();
  });
});
