import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { composed, disclosed, pressed } from "#collapsible/collapsible.fixtures.tsx";
import { Content } from "#collapsible/content.tsx";

describe("Content", () => {
  it("renders a div", () => {
    const { container } = render(disclosed(<Content>The block</Content>));

    expect(slotElement(container, "collapsible", "content").tagName).toBe("DIV");
  });

  it("sets hidden while closed", () => {
    const { container } = render(composed());

    expect(slotElement(container, "collapsible", "content").hasAttribute("hidden")).toBe(true);
  });

  it("removes hidden on a press of the trigger", async () => {
    const { container } = render(composed());

    await pressed(screen.getByRole("button"));

    expect(slotElement(container, "collapsible", "content").hasAttribute("hidden")).toBe(false);
  });

  it("sets no data-state on the first render of open content", () => {
    const { container } = render(composed({ defaultOpen: true }));

    expect(slotElement(container, "collapsible", "content").dataset["state"]).toBeUndefined();
  });

  it("sets data-state closed while closed", () => {
    const { container } = render(composed());

    expect(slotElement(container, "collapsible", "content").dataset["state"]).toBe("closed");
  });

  it("takes the id the trigger's aria-controls names", () => {
    const { container } = render(composed());

    expect(slotElement(container, "collapsible", "content").id).toBe(
      screen.getByRole("button").getAttribute("aria-controls"),
    );
  });

  it("renders the element as names", () => {
    const { container } = render(disclosed(<Content as="section">The block</Content>));

    expect(slotElement(container, "collapsible", "content").tagName).toBe("SECTION");
  });
});
