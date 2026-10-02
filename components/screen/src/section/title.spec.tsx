import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { blocked } from "#section/section.fixtures.tsx";
import { Title } from "#section/title.tsx";

describe("Title", () => {
  it("renders an h2", () => {
    const { container } = render(blocked(<Title>Billing</Title>));

    expect(slotElement(container, "section", "title").tagName).toBe("H2");
  });

  it("sets role heading at level 2", () => {
    render(blocked(<Title>Billing</Title>));

    expect(screen.getByRole("heading", { level: 2, name: "Billing" })).toBeTruthy();
  });

  it("renders the level as names", () => {
    render(blocked(<Title as="h3">Billing</Title>));

    expect(screen.getByRole("heading", { level: 3 })).toBeTruthy();
  });
});
