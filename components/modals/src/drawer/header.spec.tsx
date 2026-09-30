import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { opened } from "#drawer/drawer.fixtures.tsx";
import { Header } from "#drawer/header.ts";

describe("Header", () => {
  it("renders a div", async () => {
    const { container } = await drawn(opened(<Header />));

    expect(slotElement(container, "drawer", "header").tagName).toBe("DIV");
  });

  it("applies its slot class", async () => {
    const { container } = await drawn(opened(<Header />));

    expect(slotElement(container, "drawer", "header").className).toContain("drawer__header");
  });

  it("renders no role attribute", async () => {
    const { container } = await drawn(opened(<Header />));

    expect(slotElement(container, "drawer", "header").hasAttribute("role")).toBe(false);
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(opened(<Header as="header" />));

    expect(slotElement(container, "drawer", "header").tagName).toBe("HEADER");
  });
});
