import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { paged } from "#page/page.fixtures.tsx";
import { Title } from "#page/title.ts";

describe("Title", () => {
  it("renders an h1", () => {
    const { container } = render(paged(<Title>April</Title>));

    expect(slotElement(container, "page", "title").tagName).toBe("H1");
  });

  it("sets role heading at level 1", () => {
    render(paged(<Title>April</Title>));

    expect(screen.getByRole("heading", { level: 1, name: "April" })).toBeTruthy();
  });

  it("renders the level as names", () => {
    render(paged(<Title as="h2">April</Title>));

    expect(screen.getByRole("heading", { level: 2 })).toBeTruthy();
  });
});
