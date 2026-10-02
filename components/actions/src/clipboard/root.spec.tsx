import { act, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { clipped, composed, LINK, pressed } from "#clipboard/clipboard.fixtures.tsx";
import { recipe } from "#clipboard/recipe.ts";
import { Root, type RootProps } from "#clipboard/root.tsx";
import { Trigger } from "#clipboard/trigger.tsx";

const UNSET: string | undefined = undefined;

describe("Root", () => {
  it("returns no accessibility violation for a label, a field and a trigger together", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("emits a root-slot class for every variant value the recipe declares", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "root",
      }),
    ).toStrictEqual([]);
  });

  it("renders no role attribute on the container", () => {
    const { container } = render(composed());

    expect(slotElement(container, "clipboard", "root").hasAttribute("role")).toBe(false);
  });

  it("renders a SECTION when as is set to section", () => {
    const { container } = render(composed({ as: "section" }));

    expect(slotElement(container, "clipboard", "root").tagName).toBe("SECTION");
  });

  it("writes the value to the system clipboard when the trigger is clicked", async () => {
    render(composed());
    await pressed(screen.getByRole("button"));

    await expect(navigator.clipboard.readText()).resolves.toBe(LINK);
  });

  it("sets data-copied on the root, the control and the trigger after a copy", async () => {
    const { container } = render(composed());
    await pressed(screen.getByRole("button"));

    expect(slotElement(container, "clipboard", "root").dataset["copied"]).toBe("");
    expect(slotElement(container, "clipboard", "control").dataset["copied"]).toBe("");
    expect(slotElement(container, "clipboard", "trigger").dataset["copied"]).toBe("");
  });

  it("leaves data-copied off the root before any copy", () => {
    const { container } = render(composed());

    expect(slotElement(container, "clipboard", "root").dataset["copied"]).toBeUndefined();
  });

  it("removes data-copied once the caller's timeout has elapsed", async () => {
    vi.useFakeTimers();

    try {
      const { container } = render(composed({ timeout: 50 }));
      await pressed(screen.getByRole("button"));
      await act(() => vi.advanceTimersByTimeAsync(80));

      expect(slotElement(container, "clipboard", "root").dataset["copied"]).toBeUndefined();
    } finally {
      vi.useRealTimers();
    }
  });

  it("calls onStatusChange once with copied true per copy", async () => {
    const told = vi.fn<(details: { readonly copied: boolean }) => void>();

    render(composed({ onStatusChange: told }));
    await pressed(screen.getByRole("button"));

    expect(told).toHaveBeenCalledExactlyOnceWith({ copied: true });
  });

  it("copies defaultValue when the caller passes no value", async () => {
    render(clipped(<Trigger>Copy</Trigger>, { defaultValue: "4109", value: UNSET }));
    await pressed(screen.getByRole("button"));

    await expect(navigator.clipboard.readText()).resolves.toBe("4109");
  });

  it("derives the field's id from the id the caller passes", () => {
    render(composed({ id: "payout" }));

    expect(screen.getByLabelText("Link to the payout").id).toContain("payout");
  });

  it("renders two roots side by side when neither is given an id", () => {
    render(<Root />);
    render(<Root />);

    expect(document.querySelectorAll("[data-scope=clipboard][data-part=root]")).toHaveLength(2);
  });
});
