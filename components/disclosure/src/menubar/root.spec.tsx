import { act, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, drawn, pressed } from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement } from "@stealthscale/testing-theme";

import { bar, focused, keyed, named, observer } from "#menubar/menubar.fixtures.tsx";
import { recipe } from "#menubar/recipe.ts";
import { type RootProps } from "#menubar/root.tsx";

describe("Root", () => {
  it("renders a menubar named by aria-label", async () => {
    await drawn(bar());

    expect(screen.getByRole("menubar", { name: "Editor" })).toBeDefined();
  });

  it("renders a div", async () => {
    const { container } = await drawn(bar());

    expect(slotElement(container, "menubar", "root").tagName).toBe("DIV");
  });

  it("applies the class of every variant value", async () => {
    await expect(
      boundMachineViolations(
        recipe,
        async (props: RootProps) => (await drawn(bar(props))).container,
        { slot: "root" },
      ),
    ).resolves.toStrictEqual([]);
  });

  it("writes dir on the root", async () => {
    const { container } = await drawn(bar({ dir: "rtl" }));

    expect(slotElement(container, "menubar", "root").getAttribute("dir")).toBe("rtl");
  });

  it("moves focus to the next name on ArrowRight", async () => {
    await drawn(bar());
    await keyed(focused("File"), "ArrowRight");

    expect(document.activeElement).toBe(named("Edit"));
  });

  it("moves focus from the last name to the first on ArrowRight", async () => {
    await drawn(bar());
    await keyed(focused("View"), "ArrowRight");

    expect(document.activeElement).toBe(named("File"));
  });

  it("keeps focus on the last name on ArrowRight when loop is false", async () => {
    await drawn(bar({ loop: false }));
    await keyed(focused("View"), "ArrowRight");

    expect(document.activeElement).toBe(named("View"));
  });

  it("moves focus to the last name on End", async () => {
    await drawn(bar());
    await keyed(focused("File"), "End");

    expect(document.activeElement).toBe(named("View"));
  });

  it("sets data-crowded once a resize finds the names too wide", async () => {
    const resize = observer();
    const { container } = await drawn(bar());

    vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockReturnValue(400);
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(354);
    act(() => {
      resize();
    });

    expect(slotElement(container, "menubar", "root").dataset["crowded"]).toBe("");
  });

  it("leaves data-crowded out while the names fit", async () => {
    const { container } = await drawn(bar());

    expect(slotElement(container, "menubar", "root").dataset["crowded"]).toBeUndefined();
  });

  it("renders the fold trigger with the words Menu by default", async () => {
    await drawn(bar());

    expect(screen.getByRole("button", { name: "Menu" }).getAttribute("aria-haspopup")).toBe("menu");
  });

  it("renders the fold trigger with the fold words", async () => {
    await drawn(bar({ fold: "More" }));

    expect(screen.getByRole("button", { name: "More" })).toBeDefined();
  });

  it("renders foldIcon before the fold words", async () => {
    await drawn(bar({ foldIcon: <svg data-testid="icon" /> }));

    expect(screen.getByRole("button", { name: "Menu" }).firstElementChild).toBe(
      screen.getByTestId("icon"),
    );
  });

  it("opens a menu with a row per menu of the bar from the fold trigger", async () => {
    await drawn(bar());
    await pressed(screen.getByRole("button", { name: "Menu" }));

    expect(
      within(screen.getByRole("menu"))
        .getAllByRole("menuitem")
        .map((row) => row.textContent),
    ).toStrictEqual(["File", "Edit", "View"]);
  });

  it("opens a menu of the bar from its row in the folded menu", async () => {
    await drawn(bar());
    await pressed(screen.getByRole("button", { name: "Menu" }));
    await pressed(within(screen.getByRole("menu")).getByRole("menuitem", { name: "Edit" }));

    expect(screen.getByRole("menuitem", { name: "Undo" })).toBeDefined();
  });

  it("passes axe with every menu closed", async () => {
    await expect(accessibilityViolations(() => bar())).resolves.toStrictEqual([]);
  });
});
