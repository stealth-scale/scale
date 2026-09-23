import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { alerted, composed } from "#alert/alert.fixtures.tsx";
import { recipe } from "#alert/recipe.ts";
import { type RootProps } from "#alert/root.tsx";
import { Title } from "#alert/title.ts";

describe("Title", () => {
  it("renders a span by default", () => {
    const { container } = render(alerted(<Title>Payment failed</Title>));

    expect(slotElement(container, "alert", "title").tagName).toBe("SPAN");
  });

  it("applies the class of every variant value set on the root", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "title",
      }),
    ).toStrictEqual([]);
  });

  it("renders no heading role by default", () => {
    render(alerted(<Title>Payment failed</Title>));

    expect(screen.queryByRole("heading")).toBeNull();
  });

  it("renders a level 2 heading when as is h2", () => {
    render(alerted(<Title as="h2">Payment failed</Title>));

    expect(screen.getByRole("heading", { level: 2, name: "Payment failed" })).toBeDefined();
  });
});
