import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, drawn, pressed } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { narrowed } from "#app-shell/app-shell.fixtures.tsx";
import { recipe } from "#toolbar/recipe.ts";
import { composed, folding, type Settings } from "#toolbar/toolbar.fixtures.tsx";

describe("Root", () => {
  it("passes axe with three bands", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("applies the class of every variant value", () => {
    expect(
      boundViolations(recipe, (props: Settings) => render(composed(props)).container, {
        slot: "root",
      }),
    ).toStrictEqual([]);
  });

  it("sets role toolbar", () => {
    render(composed());

    expect(screen.getByRole("toolbar")).toBeTruthy();
  });

  it("takes its name from aria-label", () => {
    render(composed());

    expect(screen.getByRole("toolbar", { name: "Invoice" })).toBeTruthy();
  });

  it("leaves one tab stop across the controls", () => {
    render(composed());

    expect(screen.getAllByRole("button").filter((control) => control.tabIndex === 0)).toHaveLength(
      1,
    );
  });

  it("renders a div", () => {
    const { container } = render(composed());

    expect(slotElement(container, "toolbar", "root")).toBeTruthy();
  });

  it("sets no data-narrow where the document measures no width", () => {
    const { container } = render(composed());

    expect(slotElement(container, "toolbar", "root").dataset["narrow"]).toBeUndefined();
  });

  it("renders no menu on a wide row", () => {
    render(folding());

    expect(screen.queryByRole("button", { name: "More actions" })).toBeNull();
  });

  it("renders the menu's trigger as the last control of a narrow row", () => {
    render(narrowed(folding()));

    expect(screen.getAllByRole("button").map((control) => control.textContent)).toStrictEqual([
      "Filter",
      "Export",
      "More actions",
    ]);
  });

  it("names the menu with more", () => {
    render(narrowed(folding({ more: "More invoice actions" })));

    expect(screen.getByRole("button", { name: "More invoice actions" })).toBeTruthy();
  });

  it("keeps the menu's trigger in the row's arrow-key order", () => {
    render(narrowed(folding()));

    expect(screen.getByRole("button", { name: "More actions" }).tabIndex).toBe(-1);
  });

  it("lists the folded action in the menu", async () => {
    await drawn(narrowed(folding()));
    await pressed(screen.getByRole("button", { name: "More actions" }));

    expect(screen.getAllByRole("menuitem").map((row) => row.textContent)).toStrictEqual([
      "Columns",
    ]);
  });

  it("moves focus from the last control to the first on ArrowRight", () => {
    render(composed());
    act(() => {
      screen.getByRole("button", { name: "Download" }).focus();
    });

    fireEvent.keyDown(screen.getByRole("button", { name: "Download" }), { key: "ArrowRight" });

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Filter" }));
  });

  it("keeps focus on the last control on ArrowRight when wrap is false", () => {
    render(composed({ wrap: false }));
    act(() => {
      screen.getByRole("button", { name: "Download" }).focus();
    });

    fireEvent.keyDown(screen.getByRole("button", { name: "Download" }), { key: "ArrowRight" });

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Download" }));
  });
});
