import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { opened } from "#dialog/dialog.fixtures.tsx";
import { Header } from "#dialog/header.ts";

describe("Header", () => {
  it("renders a div", async () => {
    const { container } = await drawn(opened(<Header />));

    expect(slotElement(container, "dialog", "header").tagName).toBe("DIV");
  });

  it("applies its slot class", async () => {
    const { container } = await drawn(opened(<Header />));

    expect(slotElement(container, "dialog", "header").className).toContain("dialog__header");
  });

  it("renders no role attribute", async () => {
    const { container } = await drawn(opened(<Header />));

    expect(slotElement(container, "dialog", "header").hasAttribute("role")).toBe(false);
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(opened(<Header as="header" />));

    expect(slotElement(container, "dialog", "header").tagName).toBe("HEADER");
  });
});
