import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { Root } from "#switcher/root.tsx";
import { composed } from "#switcher/switcher.fixtures.tsx";
import { Trigger } from "#switcher/trigger.tsx";

describe("Root", () => {
  it("draws the control and nothing of its own inside it", () => {
    const { container } = render(
      <Root>
        <Trigger label="Workspace">Acme</Trigger>
      </Root>,
    );

    expect(container.querySelector("button")).toBeTruthy();
  });

  it("hands its variants to the control below it", () => {
    const { container } = render(
      <Root size="lg">
        <Trigger label="Workspace">Acme</Trigger>
      </Root>,
    );

    expect(slotClasses(container, "switcher", "root")).toContain(
      variantClass(slotClass("switcher", "root"), "size", "lg"),
    );
  });

  it("hands its size to the menu so the rows are drawn at the control's step", async () => {
    const { container } = await drawn(composed({ size: "lg" }));

    expect(slotClasses(container, "menu", "content")).toContain(
      variantClass(slotClass("menu", "content"), "size", "lg"),
    );
  });

  it("draws the menu at the middle step where none is asked for", async () => {
    const { container } = await drawn(composed());

    expect(slotClasses(container, "menu", "content")).toContain(
      variantClass(slotClass("menu", "content"), "size", "md"),
    );
  });

  it("draws the control in the look it is given", () => {
    const { container } = render(
      <Root variant="outline">
        <Trigger label="Workspace">Acme</Trigger>
      </Root>,
    );

    expect(slotClasses(container, "switcher", "root")).toContain(
      variantClass(slotClass("switcher", "root"), "variant", "outline"),
    );
  });

  it("keeps the menu closed until it is asked to open", () => {
    render(
      <Root>
        <Trigger label="Workspace">Acme</Trigger>
      </Root>,
    );

    expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("false");
  });
});
