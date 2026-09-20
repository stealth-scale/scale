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
  it("breaks no accessibility rule holding a label, a field and a trigger", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "root",
      }),
    ).toStrictEqual([]);
  });

  it("carries no role because the field and the trigger carry their own meaning", () => {
    const { container } = render(composed());

    expect(slotElement(container, "clipboard", "root").hasAttribute("role")).toBe(false);
  });

  it("draws the element as names", () => {
    const { container } = render(composed({ as: "section" }));

    expect(slotElement(container, "clipboard", "root").tagName).toBe("SECTION");
  });

  it("writes the value to the clipboard when the trigger is pressed", async () => {
    render(composed());
    await pressed(screen.getByRole("button"));

    await expect(navigator.clipboard.readText()).resolves.toBe(LINK);
  });

  it("marks every part copied for a while after a press", async () => {
    const { container } = render(composed());
    await pressed(screen.getByRole("button"));

    expect(slotElement(container, "clipboard", "root").dataset["copied"]).toBe("");
    expect(slotElement(container, "clipboard", "control").dataset["copied"]).toBe("");
    expect(slotElement(container, "clipboard", "trigger").dataset["copied"]).toBe("");
  });

  it("marks nothing copied before a press", () => {
    const { container } = render(composed());

    expect(slotElement(container, "clipboard", "root").dataset["copied"]).toBeUndefined();
  });

  it("clears the mark after the timeout a caller sets", async () => {
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

  it("tells a caller each time it copies", async () => {
    const told = vi.fn<(details: { readonly copied: boolean }) => void>();

    render(composed({ onStatusChange: told }));
    await pressed(screen.getByRole("button"));

    expect(told).toHaveBeenCalledExactlyOnceWith({ copied: true });
  });

  it("copies a default value a caller sets without driving it", async () => {
    render(clipped(<Trigger>Copy</Trigger>, { defaultValue: "4109", value: UNSET }));
    await pressed(screen.getByRole("button"));

    await expect(navigator.clipboard.readText()).resolves.toBe("4109");
  });

  it("builds the reference between the label and the field from the id a caller names", () => {
    render(composed({ id: "payout" }));

    expect(screen.getByLabelText("Link to the payout").id).toContain("payout");
  });

  it("generates an id where a caller names none", () => {
    render(<Root />);
    render(<Root />);

    expect(document.querySelectorAll("[data-scope=clipboard][data-part=root]")).toHaveLength(2);
  });
});
