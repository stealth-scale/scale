import { render, screen } from "@testing-library/react";
import { describe, expect, expectTypeOf, it } from "vitest";

import { pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed, narrowed, shell } from "#app-shell/app-shell.fixtures.tsx";
import { Body, type BodyProps } from "#app-shell/body.tsx";

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

  it("renders the panels and the main region in source order in the row", () => {
    const { container } = render(composed());
    const row = slotElement(container, "app-shell", "row");

    expect(
      [...row.children].map((child) =>
        [...child.classList].find((name) => name.startsWith("app-shell__")),
      ),
    ).toStrictEqual([
      "app-shell__navbar",
      "app-shell__main",
      "app-shell__aside",
      "app-shell__backdrop",
    ]);
  });

  it("renders the row inside the body's viewport", () => {
    const { container } = render(composed());

    expect(slotElement(container, "app-shell", "row").parentElement?.className).toContain(
      "app-shell__body-viewport",
    );
  });

  it("keeps the body's viewport out of the tab order", () => {
    const { container } = render(composed());

    expect(slotElement(container, "app-shell", "bodyViewport").tabIndex).toBe(-1);
  });

  it("omits as from its props", () => {
    expectTypeOf<BodyProps>().not.toHaveProperty("as");
    expect(Body).toBeDefined();
  });
});
