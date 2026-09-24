import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { composed, pressed } from "#collapsible/collapsible.fixtures.tsx";
import { recipe } from "#collapsible/recipe.ts";
import { Root, type RootProps } from "#collapsible/root.tsx";

describe("Root", () => {
  it("returns no accessibility violation", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("applies the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "root",
      }),
    ).toStrictEqual([]);
  });

  it("sets no role", () => {
    const { container } = render(composed());

    expect(slotElement(container, "collapsible", "root").hasAttribute("role")).toBe(false);
  });

  it("renders the element as names", () => {
    const { container } = render(composed({ as: "section" }));

    expect(slotElement(container, "collapsible", "root").tagName).toBe("SECTION");
  });

  it("starts closed", () => {
    render(composed());

    expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("false");
  });

  it("starts open with defaultOpen", () => {
    render(composed({ defaultOpen: true }));

    expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("true");
  });

  it("opens on a press of the trigger", async () => {
    render(composed());
    await pressed(screen.getByRole("button"));

    expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("true");
  });

  it("calls onOpenChange with the new state", async () => {
    const told = vi.fn<(details: { readonly open: boolean }) => void>();

    render(composed({ onOpenChange: told }));
    await pressed(screen.getByRole("button"));

    expect(told).toHaveBeenLastCalledWith(expect.objectContaining({ open: true }));
  });

  it("keeps a controlled open state on a press", async () => {
    render(composed({ open: true }));
    await pressed(screen.getByRole("button"));

    expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("true");
  });

  it("ignores a press while disabled", async () => {
    render(composed({ disabled: true }));
    await pressed(screen.getByRole("button"));

    expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("false");
  });

  it("derives aria-controls from the id", () => {
    render(composed({ id: "details" }));

    const named = screen.getByRole("button").getAttribute("aria-controls");

    expect(named).toBeTruthy();
    expect(named).toContain("details");
  });

  it("generates an id without the prop", () => {
    render(<Root />);
    render(<Root />);

    expect(document.querySelectorAll("[data-scope=collapsible][data-part=root]")).toHaveLength(2);
  });
});
