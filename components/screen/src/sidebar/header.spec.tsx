import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Header } from "#sidebar/header.ts";
import { aside } from "#sidebar/sidebar.fixtures.tsx";

describe("Header", () => {
  it("renders a div inside the root", () => {
    const { container } = render(aside(<Header>Acme</Header>));

    expect(slotElement(container, "sidebar", "header").tagName).toBe("DIV");
  });

  it("renders as a child of the root outside the content", () => {
    const { container } = render(aside(<Header>Acme</Header>));

    expect(slotElement(container, "sidebar", "header").parentElement).toBe(
      slotElement(container, "sidebar", "root"),
    );
  });
});
