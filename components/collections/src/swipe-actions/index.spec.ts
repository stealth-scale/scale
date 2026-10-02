import { describe, expect, it } from "vitest";

import { rootedViolations } from "@stealthscale/testing-react";

import { Action } from "#swipe-actions/action.tsx";
import { Actions } from "#swipe-actions/actions.tsx";
import { Content } from "#swipe-actions/content.tsx";
import * as barrel from "#swipe-actions/index.ts";

describe("index", () => {
  it("exports the four parts and settleSwipe alone", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Action",
      "Actions",
      "Content",
      "Root",
      "settleSwipe",
    ]);
  });

  it("throws for every part rendered outside a root", () => {
    expect(
      rootedViolations(
        { Action, Actions, Content },
        "A part of SwipeActions was drawn outside the root that holds it together.",
      ),
    ).toStrictEqual([]);
  });
});
