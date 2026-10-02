import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Header } from "#page/header.tsx";
import { paged } from "#page/page.fixtures.tsx";

describe("Header", () => {
  it("renders a header", () => {
    const { container } = render(paged(<Header>April</Header>));

    expect(slotElement(container, "page", "header").tagName).toBe("HEADER");
  });

  it("sets data-sticky when sticky", () => {
    const { container } = render(paged(<Header sticky>April</Header>));

    expect(slotElement(container, "page", "header").dataset["sticky"]).toBe("");
  });

  it("sets no data-sticky by default", () => {
    const { container } = render(paged(<Header>April</Header>));

    expect(slotElement(container, "page", "header").dataset["sticky"]).toBeUndefined();
  });
});
