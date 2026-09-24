import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed, narrowed, shell } from "#app-shell/app-shell.fixtures.tsx";
import { Header } from "#app-shell/header.tsx";

describe("Header", () => {
  it("renders a header inside the root", () => {
    const { container } = render(shell(<Header>Acme</Header>));

    expect(slotElement(container, "app-shell", "header").tagName).toBe("HEADER");
  });

  it("exposes the banner landmark", () => {
    render(shell(<Header>Acme</Header>));

    expect(screen.getByRole("banner")).toBeTruthy();
  });

  it("omits data-sticky when sticky is not passed", () => {
    const { container } = render(shell(<Header>Acme</Header>));

    expect(slotElement(container, "app-shell", "header").dataset["sticky"]).toBeUndefined();
  });

  it("writes data-sticky when sticky is passed", () => {
    const { container } = render(shell(<Header sticky>Acme</Header>));

    expect(slotElement(container, "app-shell", "header").dataset["sticky"]).toBe("");
  });

  it("stays interactive while no panel is over the page", () => {
    const { container } = render(composed());

    expect(slotElement(container, "app-shell", "header").inert).toBe(false);
  });

  it("becomes inert while a panel is over the page", async () => {
    const { container } = render(narrowed(composed()));

    await pressed(screen.getByRole("button", { name: "Navigation" }));

    expect(slotElement(container, "app-shell", "header").inert).toBe(true);
  });
});
