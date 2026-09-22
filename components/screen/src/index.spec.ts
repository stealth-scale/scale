import { describe, expect, it } from "vitest";

import * as barrel from "#index.ts";

describe("index", () => {
  it("names every component the package publishes and nothing beside them", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "AppShell",
      "Page",
      "Section",
      "Sidebar",
      "Switcher",
      "Toolbar",
    ]);
  });

  it("publishes each component as a namespace of its short names", () => {
    expect(Object.keys(barrel.AppShell).toSorted()).toStrictEqual([
      "Aside",
      "Body",
      "COLLAPSES",
      "FOLDS",
      "Footer",
      "Header",
      "Main",
      "Navbar",
      "Root",
      "Trigger",
      "useAppShellPanel",
      "useNearestPanel",
      "useOverlaid",
    ]);
    expect(Object.keys(barrel.Sidebar).toSorted()).toStrictEqual([
      "Content",
      "Empty",
      "Footer",
      "Header",
      "Nav",
      "NavAction",
      "NavHeading",
      "NavLabel",
      "Root",
      "Search",
      "Separator",
    ]);
  });

  it("publishes neither a recipe nor a binding", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with)/u);
    }
  });
});
