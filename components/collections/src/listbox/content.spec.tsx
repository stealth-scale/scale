import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Content } from "#listbox/content.tsx";
import { composed, offered } from "#listbox/listbox.fixtures.tsx";

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
});
