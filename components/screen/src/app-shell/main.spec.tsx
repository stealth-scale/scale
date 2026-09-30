import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { bodied, composed, narrowed } from "#app-shell/app-shell.fixtures.tsx";
import { Main } from "#app-shell/main.tsx";

describe("Main", () => {
  it("renders a main element inside the body", () => {
    const { container } = render(bodied(<Main>Billing</Main>));

    expect(slotElement(container, "app-shell", "mainViewport").tagName).toBe("MAIN");
  });

  it("exposes the main landmark", () => {
    render(bodied(<Main>Billing</Main>));

    expect(screen.getByRole("main")).toBeTruthy();
  });

  it("keeps the main role on the element that scrolls", () => {
    const { container } = render(bodied(<Main>Billing</Main>));

    expect(slotElement(container, "app-shell", "mainViewport").getAttribute("role")).toBe("main");
  });

  it("passes its props to the main element", () => {
    render(bodied(<Main id="content">Billing</Main>));

    expect(screen.getByRole("main").id).toBe("content");
  });

  it("renders the page in the column inside the main element", () => {
    const { container } = render(bodied(<Main>Billing</Main>));

    expect(slotElement(container, "app-shell", "column").parentElement?.tagName).toBe("MAIN");
  });

  it("leaves the region interactive while no panel is over the page", () => {
    const { container } = render(composed());

    expect(slotElement(container, "app-shell", "main").inert).toBe(false);
  });

  it("becomes inert while a panel is over the page", async () => {
    const { container } = render(narrowed(composed()));

    await pressed(screen.getByRole("button", { name: "Navigation" }));

    expect(slotElement(container, "app-shell", "main").inert).toBe(true);
  });
});
