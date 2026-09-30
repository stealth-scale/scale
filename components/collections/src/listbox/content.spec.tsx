import { render, screen } from "@testing-library/react";
import { describe, expect, expectTypeOf, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Content, type ContentProps } from "#listbox/content.tsx";
import { composed, offered, overflowing } from "#listbox/listbox.fixtures.tsx";

describe("Content", () => {
  it("renders a div", () => {
    const { container } = render(offered(<Content />));

    expect(slotElement(container, "listbox", "content").tagName).toBe("DIV");
  });

  it("renders the element with the listbox role", () => {
    render(offered(<Content />));

    expect(screen.getByRole("listbox")).toBeTruthy();
  });

  it("sets tabindex 0", () => {
    render(offered(<Content />));

    expect(screen.getByRole("listbox").getAttribute("tabindex")).toBe("0");
  });

  it("points aria-activedescendant at the highlighted row", () => {
    render(composed({ defaultHighlightedValue: "reports" }));

    expect(screen.getByRole("listbox").getAttribute("aria-activedescendant")).toBe(
      screen.getByRole("option", { name: "Reports" }).id,
    );
  });

  it("renders the rows inside a scroll area's viewport", () => {
    const { container } = render(composed());

    expect(slotElement(container, "listbox", "rows").parentElement).toBe(
      slotElement(container, "listbox", "viewport"),
    );
  });

  it("renders the listbox as the scroll area's viewport", () => {
    const { container } = render(composed());

    expect(screen.getByRole("listbox")).toBe(slotElement(container, "listbox", "viewport"));
  });

  it("renders the content as the scroll area's root", () => {
    const { container } = render(composed());

    expect(slotElement(container, "listbox", "content").className).toContain("scroll-area__root");
  });

  it("hides the bar while the rows fit the listbox's element", async () => {
    overflowing(false);
    const { container } = await drawn(composed());

    expect(slotElement(container, "scroll-area", "scrollbar").dataset["overflowY"]).toBeUndefined();
  });

  it("omits as from its props", () => {
    expectTypeOf<ContentProps>().not.toHaveProperty("as");
    expect(Content).toBeDefined();
  });

  it("scrolls a vertical list top to bottom", () => {
    const { container } = render(composed());

    expect(slotElement(container, "scroll-area", "scrollbar").dataset["orientation"]).toBe(
      "vertical",
    );
  });

  it("scrolls a horizontal list sideways", () => {
    const { container } = render(composed({ orientation: "horizontal" }));

    expect(slotElement(container, "scroll-area", "scrollbar").dataset["orientation"]).toBe(
      "horizontal",
    );
  });

  it("lets the rows of a horizontal list grow past the viewport", () => {
    const { container } = render(composed({ orientation: "horizontal" }));

    expect(slotElement(container, "listbox", "rows").className).toContain(
      "scroll-area__content--horizontal",
    );
  });

  it("sets the machine's direction on the scroll area", () => {
    const { container } = render(composed({ dir: "rtl" }));

    expect(slotElement(container, "scroll-area", "root").getAttribute("dir")).toBe("rtl");
  });
});
