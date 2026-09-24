import { fireEvent, screen } from "@testing-library/react";
import { setInteractionModality } from "@zag-js/focus-visible";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, drawn, settled } from "@stealthscale/testing-react";

import { composed } from "#tooltip/tooltip.fixtures.tsx";

describe("Root", () => {
  it("returns no accessibility violation", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("renders a div", async () => {
    const { container } = await drawn(composed());

    expect(container.firstElementChild?.tagName).toBe("DIV");
  });

  it("starts closed", async () => {
    await drawn(composed());

    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("starts open with defaultOpen", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("tooltip")).toBeDefined();
  });

  it("opens on keyboard focus of the trigger", async () => {
    await drawn(composed({ openDelay: 0 }));
    setInteractionModality("keyboard");
    fireEvent.focus(screen.getByRole("button"));
    await settled();

    expect(screen.getByRole("tooltip")).toBeDefined();
  });

  it("stays closed on pointer focus of the trigger", async () => {
    await drawn(composed({ openDelay: 0 }));
    setInteractionModality("pointer");
    fireEvent.focus(screen.getByRole("button"));
    await settled();

    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("calls onOpenChange with the new state", async () => {
    const told = vi.fn<(details: { readonly open: boolean }) => void>();

    await drawn(composed({ onOpenChange: told, openDelay: 0 }));
    setInteractionModality("keyboard");
    fireEvent.focus(screen.getByRole("button"));
    await settled();

    expect(told).toHaveBeenLastCalledWith(expect.objectContaining({ open: true }));
  });

  it("opens with a controlled open", async () => {
    await drawn(composed({ open: true }));

    expect(screen.getByRole("tooltip")).toBeDefined();
  });

  it("ignores focus while disabled", async () => {
    await drawn(composed({ disabled: true, openDelay: 0 }));
    fireEvent.focus(screen.getByRole("button"));
    await settled();

    expect(screen.queryByRole("tooltip")).toBeNull();
  });
});
