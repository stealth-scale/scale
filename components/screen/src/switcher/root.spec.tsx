import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotClass, slotClasses, slotElement, variantClass } from "@stealthscale/testing-theme";

import { Root } from "#switcher/root.tsx";
import { chosen, composed } from "#switcher/switcher.fixtures.tsx";
import { Trigger } from "#switcher/trigger.tsx";

describe("Root", () => {
  it("renders the trigger as its only element", () => {
    const { container } = render(
      <Root>
        <Trigger label="Workspace">Acme</Trigger>
      </Root>,
    );

    expect(container.querySelector("button")).toBeTruthy();
  });

  it("applies its size to the trigger", () => {
    const { container } = render(
      <Root size="lg">
        <Trigger label="Workspace">Acme</Trigger>
      </Root>,
    );

    expect(slotClasses(container, "switcher", "root")).toContain(
      variantClass(slotClass("switcher", "root"), "size", "lg"),
    );
  });

  it("passes its size to the menu", async () => {
    const { container } = await drawn(composed({ size: "lg" }));

    expect(slotClasses(container, "menu", "content")).toContain(
      variantClass(slotClass("menu", "content"), "size", "lg"),
    );
  });

  it("renders the menu at md without a size", async () => {
    const { container } = await drawn(composed());

    expect(slotClasses(container, "menu", "content")).toContain(
      variantClass(slotClass("menu", "content"), "size", "md"),
    );
  });

  it("applies its variant to the trigger", () => {
    const { container } = render(
      <Root variant="outline">
        <Trigger label="Workspace">Acme</Trigger>
      </Root>,
    );

    expect(slotClasses(container, "switcher", "root")).toContain(
      variantClass(slotClass("switcher", "root"), "variant", "outline"),
    );
  });

  it("sizes the menu to the control at the head of a sidebar", async () => {
    const { container } = await drawn(composed({ placement: "sidebar" }));

    expect(slotElement(container, "menu", "positioner").style.width).toBe("var(--reference-width)");
  });

  it("sizes the menu to its rows on its own", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "menu", "positioner").style.width).toBe("");
  });

  it("applies a caller's positioning over the sidebar width", async () => {
    const { container } = await drawn(
      composed({ placement: "sidebar", positioning: { sameWidth: false } }),
    );

    expect(slotElement(container, "menu", "positioner").style.width).toBe("");
  });

  it("renders the menu closed by default", () => {
    render(
      <Root>
        <Trigger label="Workspace">Acme</Trigger>
      </Root>,
    );

    expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("false");
  });

  it("renders the first choice in the trigger without a value", () => {
    render(chosen());

    expect(screen.getByRole("button").textContent).toBe("WorkspaceAAcmePro plan⇕");
  });

  it("renders the choice the value names in the trigger", () => {
    render(chosen({ value: "globex" }));

    expect(screen.getByRole("button", { name: "Workspace Globex Corporation" })).toBeTruthy();
  });

  it("renders one row per choice", async () => {
    await drawn(chosen({ defaultOpen: true }));

    expect(screen.getAllByRole("menuitemradio").map((row) => row.textContent)).toStrictEqual([
      "✓AAcmePro plan",
      "✓GCGlobex Corporation",
      "✓OBOld Books",
    ]);
  });

  it("renders its children after a separator", async () => {
    await drawn(chosen({ defaultOpen: true }));

    expect(screen.getByRole("separator").nextElementSibling?.textContent).toBe("New workspace");
  });
});
