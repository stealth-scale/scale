import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement, variantClass } from "@stealthscale/testing-theme";

import { turned } from "#message/message.fixtures.tsx";
import { recipe } from "#message/recipe.ts";
import { Root, type RootProps } from "#message/root.ts";

describe("Root", () => {
  it("returns no conformance violation for its ARTICLE root", () => {
    expect(violations(Root, { as: true, children: true, element: "ARTICLE" })).toStrictEqual([]);
  });

  it("returns no accessibility violation for a complete turn", async () => {
    await expect(accessibilityViolations(() => turned())).resolves.toStrictEqual([]);
  });

  it("returns no accessibility violation for a turn at the end of the line", async () => {
    await expect(
      accessibilityViolations(() => turned({ align: "end", look: "solid", palette: "primary" })),
    ).resolves.toStrictEqual([]);
  });

  it("emits a class for every variant value the recipe declares", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(turned(props)).container, {
        slot: "root",
      }),
    ).toStrictEqual([]);
  });

  it("applies the align class passed as align", () => {
    const { container } = render(turned({ align: "end" }));

    expect(slotElement(container, "message", "root").className).toContain(
      variantClass("message__root", "align", "end"),
    );
  });

  it("renders the turn as an article", () => {
    render(turned());

    expect(screen.getAllByRole("article")).toHaveLength(1);
  });
});
