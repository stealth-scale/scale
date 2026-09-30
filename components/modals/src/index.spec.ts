import { describe, expect, it } from "vitest";

import * as barrel from "#index.ts";

describe("index", () => {
  it("limits its runtime exports to createOverlay beside the Command Dialog Drawer Tour namespaces", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Command",
      "Dialog",
      "Drawer",
      "Tour",
      "createOverlay",
    ]);
  });

  it("exposes Command as a namespace holding Clear Empty Input List and Root", () => {
    expect(Object.keys(barrel.Command).toSorted()).toStrictEqual([
      "Clear",
      "Empty",
      "Input",
      "List",
      "Root",
    ]);
  });

  it("exposes Dialog as a namespace holding its twelve parts", () => {
    expect(Object.keys(barrel.Dialog)).toHaveLength(12);
  });

  it("exposes Drawer as a namespace holding the parts Dialog holds", () => {
    expect(Object.keys(barrel.Drawer).toSorted()).toStrictEqual(
      Object.keys(barrel.Dialog).toSorted(),
    );
  });

  it("exposes Tour as a namespace holding fifteen runtime exports", () => {
    expect(Object.keys(barrel.Tour)).toHaveLength(15);
  });

  it("exports no name prefixed with recipe with or use", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use)/u);
    }
  });
});
