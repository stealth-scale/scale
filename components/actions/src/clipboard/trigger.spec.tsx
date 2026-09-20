import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { PropsProvider } from "#button/context.ts";
import { IconButton } from "#button/icon-button.ts";
import { clipped, LINK, pressed } from "#clipboard/clipboard.fixtures.tsx";
import { Trigger } from "#clipboard/trigger.tsx";

describe("Trigger", () => {
  it("conforms as a button inside the root it needs above it", () => {
    expect(
      violations(Trigger, {
        as: true,
        children: true,
        element: "BUTTON",
        subject: (container) => slotElement(container, "clipboard", "trigger"),
        wrapper: clipped,
      }),
    ).toStrictEqual([]);
  });

  it("breaks no accessibility rule", async () => {
    await expect(
      accessibilityViolations(Trigger, { props: { children: "Copy" }, wrapper: clipped }),
    ).resolves.toStrictEqual([]);
  });

  it("names itself for a screen reader before a press", () => {
    render(clipped(<Trigger>⧉</Trigger>));

    expect(screen.getByRole("button", { name: "Copy to clipboard" })).toBeDefined();
  });

  it("says the copy is made after a press", async () => {
    render(clipped(<Trigger>⧉</Trigger>));
    await pressed(screen.getByRole("button"));

    expect(screen.getByRole("button", { name: "Copied to clipboard" })).toBeDefined();
  });

  it("keeps the words a caller states over the machine's own", () => {
    render(clipped(<Trigger aria-label="Copy the link">⧉</Trigger>));

    expect(screen.getByRole("button", { name: "Copy the link" })).toBeDefined();
  });

  it("reads its words off the translations a caller sets on the root", async () => {
    render(
      clipped(<Trigger>⧉</Trigger>, {
        translations: { triggerLabel: (copied) => (copied ? "Klaar" : "Kopieer") },
      }),
    );

    expect(screen.getByRole("button", { name: "Kopieer" })).toBeDefined();

    await pressed(screen.getByRole("button"));

    expect(screen.getByRole("button", { name: "Klaar" })).toBeDefined();
  });

  it("submits nothing when it sits in a form", () => {
    render(clipped(<Trigger>⧉</Trigger>));

    expect(screen.getByRole("button").getAttribute("type")).toBe("button");
  });

  it("copies the value when pressed", async () => {
    render(clipped(<Trigger>⧉</Trigger>));
    await pressed(screen.getByRole("button"));

    await expect(navigator.clipboard.readText()).resolves.toBe(LINK);
  });

  it("keeps a handler a caller hands it beside the machine's own", async () => {
    const heard = vi.fn<() => void>();

    render(clipped(<Trigger onClick={heard}>⧉</Trigger>));
    await pressed(screen.getByRole("button"));

    expect(heard).toHaveBeenCalledOnce();
    expect(screen.getByRole("button").dataset["copied"]).toBe("");
  });

  it("draws the library's button when a caller names it", async () => {
    const { container } = render(
      clipped(
        <PropsProvider value={{ size: "sm", variant: "ghost" }}>
          <Trigger as={IconButton}>⧉</Trigger>
        </PropsProvider>,
      ),
    );
    await pressed(screen.getByRole("button"));

    const trigger = slotElement(container, "clipboard", "trigger");

    expect(trigger.classList.contains("button")).toBe(true);
    expect(trigger.classList.contains("button--ghost")).toBe(true);
    expect(trigger.classList.contains("button--sm")).toBe(true);
    expect(trigger.dataset["copied"]).toBe("");
  });
});
