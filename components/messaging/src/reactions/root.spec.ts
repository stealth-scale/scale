import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";

import { reacted } from "#reactions/reactions.fixtures.tsx";
import { Root } from "#reactions/root.tsx";

describe("Root", () => {
  it("returns no conformance violation for its FIELDSET root", () => {
    expect(violations(Root, { as: true, children: true, element: "FIELDSET" })).toStrictEqual([]);
  });

  it("returns no accessibility violation for a row of reactions", async () => {
    await expect(accessibilityViolations(() => reacted(), { frame: true })).resolves.toStrictEqual(
      [],
    );
  });

  it("renders a group named Reactions", () => {
    render(reacted());

    expect(screen.getByRole("group", { name: "Reactions" }).tagName).toBe("FIELDSET");
  });

  it("names the group by label", () => {
    render(reacted({ root: { label: "Reactions to the invoice" } }));

    expect(screen.getByRole("group", { name: "Reactions to the invoice" })).toBeDefined();
  });
});
