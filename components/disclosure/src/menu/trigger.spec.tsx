import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed, handled, listed } from "#menu/menu.fixtures.tsx";
import { Trigger } from "#menu/trigger.tsx";

describe("Trigger", () => {
  it("renders a button", async () => {
    const { container } = await drawn(listed(<Trigger>Actions</Trigger>));

    expect(slotElement(container, "menu", "trigger").tagName).toBe("BUTTON");
  });

  it("sets aria-haspopup menu", async () => {
    await drawn(composed());

    expect(screen.getByRole("button", { name: /Actions/u }).getAttribute("aria-haspopup")).toBe(
      "menu",
    );
  });

  it("sets aria-expanded to the open state", async () => {
    await drawn(composed());

    const control = screen.getByRole("button", { name: /Actions/u });

    expect(control.getAttribute("aria-expanded")).toBe("false");
    await pressed(control);

    expect(screen.getByRole("button", { name: /Actions/u }).getAttribute("aria-expanded")).toBe(
      "true",
    );
  });

  it("sets aria-controls to the menu's id", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("button", { name: /Actions/u }).getAttribute("aria-controls")).toBe(
      screen.getByRole("menu").id,
    );
  });

  it("sets data-value to its value", async () => {
    const { container } = await drawn(listed(<Trigger value="row-7">Actions</Trigger>));

    expect(slotElement(container, "menu", "trigger").dataset["value"]).toBe("row-7");
  });

  it("sets no data-value without a value", async () => {
    const { container } = await drawn(listed(<Trigger>Actions</Trigger>));

    expect(slotElement(container, "menu", "trigger").dataset["value"]).toBeUndefined();
  });

  it("calls a caller's onClick", async () => {
    const heard = vi.fn<() => void>();

    await drawn(handled(heard));
    await pressed(screen.getByRole("button", { name: "Actions" }));

    expect(heard).toHaveBeenCalledOnce();
  });
});
