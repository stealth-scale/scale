import { describe, expect, it } from "vitest";

import { rootedViolations } from "@stealthscale/testing-react";

import * as barrel from "#dialog/index.ts";

describe("index", () => {
  it("exports the twelve parts alone", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "ActionTrigger",
      "Backdrop",
      "Body",
      "CloseTrigger",
      "Content",
      "Description",
      "Footer",
      "Header",
      "Positioner",
      "Root",
      "Title",
      "Trigger",
    ]);
  });

  it("exports no recipe binding or machine", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|split|ApiProvider|PropsProvider)/u);
    }
  });

  it("throws for every part that reads the machine rendered outside a root", () => {
    const { Footer: _footer, Header: _header, Root: _root, ...parts } = barrel;

    expect(
      rootedViolations(
        parts,
        "A part of Dialog was drawn outside the root that holds it together.",
      ),
    ).toStrictEqual([]);
  });

  it("throws for the header and the footer rendered outside a root", () => {
    const { Footer, Header } = barrel;

    expect(rootedViolations({ Footer, Header }, /missing its Provider/u)).toStrictEqual([]);
  });
});
