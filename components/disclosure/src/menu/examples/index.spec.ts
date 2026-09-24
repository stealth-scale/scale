import { createElement } from "react";

import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";

import * as examples from "#menu/examples/index.ts";

describe("examples", () => {
  it("exports one namespace per example file", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual([
      "actions",
      "card",
      "ledgers",
      "more",
      "workspaces",
    ]);
  });

  it.each([
    ["Actions", examples.actions.Actions],
    ["More", examples.more.More],
    ["Workspaces", examples.workspaces.Workspaces],
  ])("returns no accessibility violation for %s open", async (_name, Example) => {
    await expect(
      accessibilityViolations(() => createElement(Example, { open: true })),
    ).resolves.toStrictEqual([]);
  });
});
