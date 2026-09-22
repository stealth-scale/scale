import { describe, expect, it } from "vitest";

import { type RouteDeclaration } from "@stealthscale/provider-router";

import { grouped } from "#catalogue/grouped.ts";
import { written } from "#catalogue/mounted.fixtures.tsx";

function nothing(): null {
  return null;
}

function names(held: ReturnType<typeof grouped>): readonly string[] {
  return held.map((one) => one.name);
}

function groupsOf(held: ReturnType<typeof grouped>, at = 0): readonly string[] {
  return (held[at]?.groups ?? []).map((one) => one.name);
}

function filed(id: string, section: string, group: string, label: string): RouteDeclaration {
  return {
    component: nothing,
    id,
    navigation: { group, label, section },
    path: id,
  };
}

describe("grouped", () => {
  it("files a page under the section its entry names", () => {
    const held = grouped([filed("a", "components", "feedback", "Alert")]);

    expect(names(held)).toStrictEqual(["components"]);
    expect(groupsOf(held)).toStrictEqual(["feedback"]);
  });

  it("files a page naming no section under an empty one", () => {
    const held = grouped([written("a", "feedback", "Alert")]);

    expect(names(held)).toStrictEqual([""]);
    expect(groupsOf(held)).toStrictEqual(["feedback"]);
  });

  it("returns one entry per group the declarations name", () => {
    const held = grouped([written("a", "Data", "A"), written("b", "Actions", "B")]);

    expect(groupsOf(held)).toStrictEqual(["Actions", "Data"]);
  });

  it("sorts the sections by name", () => {
    const held = grouped([filed("a", "zebra", "data", "A"), filed("b", "components", "data", "B")]);

    expect(names(held)).toStrictEqual(["components", "zebra"]);
  });

  it("sorts the groups of a section by name", () => {
    const held = grouped([
      filed("a", "components", "zebra", "A"),
      filed("b", "components", "actions", "B"),
    ]);

    expect(groupsOf(held)).toStrictEqual(["actions", "zebra"]);
  });

  it("sorts the pages of a group by the words the rail writes", () => {
    const held = grouped([written("a", "Data", "Zebra"), written("b", "Data", "Badge")]);

    expect(held[0]?.groups[0]?.pages.map((one) => one.entry.label)).toStrictEqual([
      "Badge",
      "Zebra",
    ]);
  });

  it("collects a page that names no group under an empty name", () => {
    expect(groupsOf(grouped([written("a", "", "A")]))).toStrictEqual([""]);
  });

  it("lists the empty section after every section the entries name", () => {
    const held = grouped([written("a", "", "A"), filed("b", "components", "data", "B")]);

    expect(names(held)).toStrictEqual(["components", ""]);
  });

  it("lists the empty group after every group the declarations name", () => {
    const held = grouped([written("a", "", "A"), written("b", "Zebra", "B")]);

    expect(groupsOf(held)).toStrictEqual(["Zebra", ""]);
  });

  it("keeps the empty name last when it was found between two others", () => {
    const held = grouped([
      written("a", "Zebra", "A"),
      written("b", "", "B"),
      written("c", "Actions", "C"),
    ]);

    expect(groupsOf(held)).toStrictEqual(["Actions", "Zebra", ""]);
  });

  it("names the route each page opens", () => {
    const held = grouped([written("docs.overview", "Theming", "Overview")]);

    expect(held[0]?.groups[0]?.pages).toStrictEqual([
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

    expect(groupsOf(grouped([odd]))).toStrictEqual([""]);
  });

  it("returns nothing for a catalogue compiled from no declaration", () => {
    expect(grouped([])).toStrictEqual([]);
  });
});
