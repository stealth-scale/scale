import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { alerted, composed } from "#alert/alert.fixtures.tsx";
import { recipe } from "#alert/recipe.ts";
import { type RootProps } from "#alert/root.tsx";
import { Title } from "#alert/title.ts";

describe("Title", () => {
  it("renders a span for the title slot", () => {
    const { container } = render(alerted(<Title>Payment failed</Title>));

    expect(slotElement(container, "alert", "title").tagName).toBe("SPAN");
  });

  it("emits a class for every variant value the recipe declares", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "title",
      }),
    ).toStrictEqual([]);
  });

  it("exposes no heading role by default", () => {
    render(alerted(<Title>Payment failed</Title>));

    expect(screen.queryByRole("heading")).toBeNull();
  });

  it("exposes a level two heading when as names h2", () => {
    render(alerted(<Title as="h2">Payment failed</Title>));

    expect(screen.getByRole("heading", { level: 2, name: "Payment failed" })).toBeDefined();
  });
});
