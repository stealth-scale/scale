import { describe, expect, it } from "vitest";

import * as barrel from "#app-shell/index.ts";

describe("index", () => {
  it("exports every part and hook", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Aside",
      "Body",
      "COLLAPSES",
      "FOLDS",
      "Footer",
      "Header",
      "Main",
      "Navbar",
      "Rail",
      "Root",
      "Section",
      "Status",
      "Trigger",
      "WINDOW_HEIGHT",
      "useAppShellPanel",
      "useNearestPanel",
      "useOverlaid",
    ]);
  });

  it("exports no internal module", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|panel|PANEL|STICKY)/u);
    }
  });
});
