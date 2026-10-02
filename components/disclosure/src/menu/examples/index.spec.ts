import { createElement } from "react";

import { act } from "@testing-library/react";
import axe from "axe-core";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import * as examples from "#menu/examples/index.ts";

/**
 * Turns off axe's page rule for content outside a landmark, because the audit reads one menu and
 * its trigger rather than a page.
 */
const RULES = { region: { enabled: false } };

describe("examples", () => {
  it("exports one namespace per example file", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual([
      "actions",
      "card",
      "column",
      "ledgers",
      "more",
      "workspaces",
    ]);
  });

  it.each([
    ["Actions", examples.actions.Actions],
    ["Column", examples.column.Column],
    ["More", examples.more.More],
    ["Workspaces", examples.workspaces.Workspaces],
  ])("renders the open panel of %s into the document body", async (_name, Example) => {
    const { container, unmount } = await drawn(createElement(Example, { open: true }));
    const panel = document.body.querySelector("[role=menu]");

    act(() => {
      unmount();
    });

    expect(panel).not.toBeNull();
    expect(container.contains(panel)).toBe(false);
  });

  it.each([
    ["Actions", examples.actions.Actions],
    ["Column", examples.column.Column],
    ["More", examples.more.More],
    ["Workspaces", examples.workspaces.Workspaces],
  ])("returns no accessibility violation in the document for %s open", async (_name, Example) => {
    const { unmount } = await drawn(createElement(Example, { open: true }));
    const { violations } = await axe.run(document.body, {
      resultTypes: ["violations"],
      rules: RULES,
    });

    act(() => {
      unmount();
    });

    expect(violations.map((each) => `${each.id}: ${each.help}`)).toStrictEqual([]);
  });
});
