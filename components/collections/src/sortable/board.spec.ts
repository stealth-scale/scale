import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { boarded } from "#sortable/sortable.fixtures.tsx";

describe("Board", () => {
  it("renders every list as a child of the lanes", () => {
    const { container } = render(boarded());

    expect(slotElement(container, "sortable", "lanes").children).toHaveLength(3);
  });

  it("renders the lanes inside a scroll area viewport", () => {
    const { container } = render(boarded());

    expect(slotElement(container, "sortable", "lanes").parentElement).toBe(
      slotElement(container, "scroll-area", "viewport"),
    );
  });

  it("renders the scroll area inside a div with the recipe's board class", () => {
    const { container } = render(boarded());

    expect(
      slotElement(container, "sortable", "board").contains(
        slotElement(container, "scroll-area", "viewport"),
      ),
    ).toBe(true);
  });

  it("keeps the scroll area viewport out of the tab order", () => {
    const { container } = render(boarded());

    expect(slotElement(container, "scroll-area", "viewport").getAttribute("tabindex")).toBe("-1");
  });
});
