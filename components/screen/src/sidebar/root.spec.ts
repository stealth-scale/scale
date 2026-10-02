import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, drawn, pressed } from "@stealthscale/testing-react";
import { boundViolations, slotElement, variantClass } from "@stealthscale/testing-theme";

import { recipe } from "#sidebar/recipe.ts";
import { type RootProps } from "#sidebar/root.tsx";
import { paneled, sheeted, shelled } from "#sidebar/shelled.fixtures.tsx";
import { composed, filtered } from "#sidebar/sidebar.fixtures.tsx";

describe("Root", () => {
  it("returns no accessibility violation for a whole sidebar", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("applies the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "root",
      }),
    ).toStrictEqual([]);
  });

  it("renders a div", () => {
    const { container } = render(composed());

    expect(slotElement(container, "sidebar", "root").tagName).toBe("DIV");
  });

  it("renders no landmark of its own", () => {
    render(composed());

    expect(screen.getAllByRole("navigation")).toHaveLength(1);
  });

  it("omits data-iconic when iconic is not passed", () => {
    const { container } = render(composed());

    expect(slotElement(container, "sidebar", "root").dataset["iconic"]).toBeUndefined();
  });

  it("writes data-iconic when iconic is passed", () => {
    const { container } = render(composed({ iconic: true }));

    expect(slotElement(container, "sidebar", "root").dataset["iconic"]).toBe("");
  });

  it("renders a rail in a panel closed to icons", () => {
    const { container } = render(paneled({ collapse: "icons", defaultOpen: false }));

    expect(slotElement(container, "sidebar", "root").dataset["iconic"]).toBe("");
  });

  it("renders in full in an open panel that closes to icons", () => {
    const { container } = render(paneled({ collapse: "icons" }));

    expect(slotElement(container, "sidebar", "root").dataset["iconic"]).toBeUndefined();
  });

  it("renders in full in a closed panel that hides", () => {
    const { container } = render(paneled({ defaultOpen: false }));

    expect(slotElement(container, "sidebar", "root").dataset["iconic"]).toBeUndefined();
  });

  it("prefers iconic over its panel", () => {
    render(paneled({ collapse: "icons", defaultOpen: false }, composed({ iconic: false })));

    expect(document.querySelector("[data-iconic]")).toBeNull();
  });

  it("makes the navigation lists inside a rail iconic", () => {
    const { container } = render(filtered({ iconic: true }));

    expect(slotElement(container, "nav-list", "root").classList).toContain(
      variantClass("nav-list__root", "iconic", "true"),
    );
  });

  it("gives the navigation lists inside it the sidebar's size", () => {
    const { container } = render(filtered({ size: "lg" }));

    expect(slotElement(container, "nav-list", "root").classList).toContain(
      variantClass("nav-list__root", "size", "lg"),
    );
  });

  it("renders at lg in a panel over the page", async () => {
    const { container } = await drawn(sheeted());

    expect(slotElement(container, "sidebar", "nav").classList).toContain(
      variantClass("sidebar__nav", "size", "lg"),
    );
  });

  it("closes its panel over the page when a link inside it is clicked", async () => {
    await drawn(sheeted());
    await pressed(screen.getByRole("button", { name: "Navigation" }));

    fireEvent.click(screen.getByRole("link", { name: "Invoices" }));

    expect(screen.getByRole("button", { name: "Navigation" }).getAttribute("aria-expanded")).toBe(
      "false",
    );
  });

  it("keeps its panel over the page open when a button inside it is clicked", async () => {
    await drawn(sheeted());
    await pressed(screen.getByRole("button", { name: "Navigation" }));

    fireEvent.click(screen.getByRole("button", { name: "Refresh" }));

    expect(screen.getByRole("button", { name: "Navigation" }).getAttribute("aria-expanded")).toBe(
      "true",
    );
  });

  it("keeps its panel in the body open when a link inside it is clicked", async () => {
    await drawn(shelled());

    fireEvent.click(screen.getByRole("link", { name: "Invoices" }));

    expect(screen.getByRole("button", { name: "Navigation" }).getAttribute("aria-expanded")).toBe(
      "true",
    );
  });
});
