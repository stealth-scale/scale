import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, drawn, settled } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { composed, overflowing } from "#listbox/listbox.fixtures.tsx";
import { recipe } from "#listbox/recipe.ts";
import { type RootProps } from "#listbox/root.tsx";

describe("Root", () => {
  it("returns no accessibility violation for a label and a list", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("applies the class of every value its recipe offers", () => {
    expect(
      boundViolations(
        recipe,
        (props: Omit<RootProps, "collection">) => render(composed(props)).container,
        { slot: "root" },
      ),
    ).toStrictEqual([]);
  });

  it("renders a div", () => {
    const { container } = render(composed());

    expect(slotElement(container, "listbox", "root").tagName).toBe("DIV");
  });

  it("sets no role on the root", () => {
    const { container } = render(composed());

    expect(slotElement(container, "listbox", "root").getAttribute("role")).toBeNull();
  });

  it("names the list from its label", () => {
    render(composed());

    expect(screen.getByRole("listbox", { name: "Places" })).toBeTruthy();
  });

  it("renders one option per collection item", () => {
    render(composed());

    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("selects the rows in value", () => {
    render(composed({ value: ["reports"] }));

    expect(screen.getByRole("option", { name: "Reports" }).getAttribute("aria-selected")).toBe(
      "true",
    );
  });

  it("scrolls the row an arrow key highlights into view in the scroll area's viewport", async () => {
    const reveal = vi.spyOn(HTMLElement.prototype, "scrollIntoView");

    overflowing();
    const { container } = await drawn(composed());
    slotElement(container, "listbox", "viewport").style.overflowY = "auto";
    fireEvent.keyDown(screen.getByRole("listbox"), { key: "ArrowDown" });
    await settled();
    const highlighted = screen.getByRole("listbox").getAttribute("aria-activedescendant");

    expect([reveal.mock.contexts.at(-1), reveal.mock.lastCall]).toStrictEqual([
      document.querySelector(`[id="${String(highlighted)}"]`),
      [{ block: "nearest" }],
    ]);
  });
});
