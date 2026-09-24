import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { Root } from "#switcher/root.tsx";
import { composed } from "#switcher/switcher.fixtures.tsx";
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

  it("renders the menu closed by default", () => {
    render(
      <Root>
        <Trigger label="Workspace">Acme</Trigger>
      </Root>,
    );

    expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("false");
  });
});
