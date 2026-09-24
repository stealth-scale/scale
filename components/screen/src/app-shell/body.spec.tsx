import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed, narrowed, shell } from "#app-shell/app-shell.fixtures.tsx";
import { Body } from "#app-shell/body.tsx";

describe("Body", () => {
  it("renders a div inside the root", () => {
    const { container } = render(shell(<Body />));

    expect(slotElement(container, "app-shell", "body").tagName).toBe("DIV");
  });

  it("renders a closed backdrop while no panel is over the page", () => {
    const { container } = render(shell(<Body />));

    expect(slotElement(container, "app-shell", "backdrop").dataset["state"]).toBe("closed");
  });

  it("hides the backdrop from the accessibility tree", () => {
    const { container } = render(shell(<Body />));

    expect(slotElement(container, "app-shell", "backdrop").getAttribute("aria-hidden")).toBe(
      "true",
    );
  });

  it("opens the backdrop while a panel is over the page", async () => {
    const { container } = render(narrowed(composed()));

    await pressed(screen.getByRole("button", { name: "Navigation" }));

    expect(slotElement(container, "app-shell", "backdrop").dataset["state"]).toBe("open");
  });

  it("closes every panel over the page on a press of the backdrop", async () => {
    const { container } = render(narrowed(composed()));

    await pressed(screen.getByRole("button", { name: "Navigation" }));
    await pressed(slotElement(container, "app-shell", "backdrop"));

    expect(slotElement(container, "app-shell", "navbar").dataset["state"]).toBe("closed");
  });

  it("renders the panels and the main region in source order", () => {
    const { container } = render(composed());
    const body = slotElement(container, "app-shell", "body");

    expect([...body.children].map((child) => child.tagName)).toStrictEqual([
      "DIV",
      "MAIN",
      "ASIDE",
      "DIV",
    ]);
  });
});
