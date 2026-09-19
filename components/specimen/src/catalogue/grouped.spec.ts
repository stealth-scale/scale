import { describe, expect, it } from "vitest";

import { grouped } from "#catalogue/grouped.ts";
import { written } from "#catalogue/mounted.fixtures.tsx";

function nothing(): null {
  return null;
}

describe("grouped", () => {
  it("returns one entry per group the declarations name", () => {
    const held = grouped([written("a", "Data", "A"), written("b", "Actions", "B")]);

    expect(held.map((one) => one.name)).toStrictEqual(["Actions", "Data"]);
  });

  it("sorts the groups by name", () => {
    const held = grouped([written("a", "Zebra", "A"), written("b", "Actions", "B")]);

    expect(held.map((one) => one.name)).toStrictEqual(["Actions", "Zebra"]);
  });

  it("sorts the pages of a group by the words the rail writes", () => {
    const held = grouped([written("a", "Data", "Zebra"), written("b", "Data", "Badge")]);

    expect(held[0]?.pages.map((one) => one.entry.label)).toStrictEqual(["Badge", "Zebra"]);
  });

  it("collects a page that names no group under an empty name", () => {
    expect(grouped([written("a", "", "A")]).map((one) => one.name)).toStrictEqual([""]);
  });

  it("lists the empty name after every group the declarations name", () => {
    const held = grouped([written("a", "", "A"), written("b", "Zebra", "B")]);

    expect(held.map((one) => one.name)).toStrictEqual(["Zebra", ""]);
  });

  it("keeps the empty name last when it was found first", () => {
    const held = grouped([written("a", "", "A"), written("b", "Actions", "B")]);

    expect(held.map((one) => one.name)).toStrictEqual(["Actions", ""]);
  });

  it("keeps the empty name last when it was found between two others", () => {
    const held = grouped([
      written("a", "Zebra", "A"),
      written("b", "", "B"),
      written("c", "Actions", "C"),
    ]);

    expect(held.map((one) => one.name)).toStrictEqual(["Actions", "Zebra", ""]);
  });

  it("names the route each page opens", () => {
    expect(grouped([written("docs.overview", "Theming", "Overview")])[0]?.pages).toStrictEqual([
      { entry: { group: "Theming", label: "Overview" }, id: "docs.overview" },
    ]);
  });

  it("leaves out a declaration that carries no entry", () => {
    expect(grouped([{ component: nothing, id: "a", path: "a" }])).toStrictEqual([]);
  });

  it("leaves out a declaration whose entry states no words", () => {
    const wrong = { component: nothing, id: "a", navigation: { group: "Data" }, path: "a" };

    expect(grouped([wrong])).toStrictEqual([]);
  });

  it("leaves out a declaration whose entry is not an object", () => {
    const wrong = { component: nothing, id: "a", navigation: "Data", path: "a" };

    expect(grouped([wrong])).toStrictEqual([]);
  });

  it("leaves out a declaration whose entry is null", () => {
    const wrong = { component: nothing, id: "a", navigation: null, path: "a" };

    expect(grouped([wrong])).toStrictEqual([]);
  });

  it("collects a page whose group is not a string under an empty name", () => {
    const odd = { component: nothing, id: "a", navigation: { group: 1, label: "A" }, path: "a" };

    expect(grouped([odd]).map((one) => one.name)).toStrictEqual([""]);
  });

  it("returns nothing for a catalogue compiled from no declaration", () => {
    expect(grouped([])).toStrictEqual([]);
  });
});
