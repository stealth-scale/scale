import { createElement } from "react";

import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";

import * as examples from "#command/examples/index.ts";

describe("examples", () => {
  it("exports one namespace per example file", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual(["commands"]);
  });

  it.each(["invoice", "zzz"])(
    "returns no accessibility violation with the query %s",
    async (query) => {
      await expect(
        accessibilityViolations(() => createElement(examples.commands.Commands, { query })),
      ).resolves.toStrictEqual([]);
    },
  );
});
