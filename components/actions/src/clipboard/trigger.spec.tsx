import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { PropsProvider } from "#button/context.ts";
import { IconButton } from "#button/icon-button.ts";
import { clipped, LINK, pressed } from "#clipboard/clipboard.fixtures.tsx";
import { Trigger } from "#clipboard/trigger.tsx";

describe("Trigger", () => {
  it("returns no conformance violation for its BUTTON slot inside a root", () => {
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

  it("returns no accessibility violation with a text child inside a root", async () => {
    await expect(
      accessibilityViolations(Trigger, { props: { children: "Copy" }, wrapper: clipped }),
    ).resolves.toStrictEqual([]);
  });

  it("takes its accessible name from the machine before a copy", () => {
    render(clipped(<Trigger>⧉</Trigger>));

    expect(screen.getByRole("button", { name: "Copy to clipboard" })).toBeDefined();
  });

  it("swaps its accessible name once the copy succeeds", async () => {
    render(clipped(<Trigger>⧉</Trigger>));
    await pressed(screen.getByRole("button"));

    expect(screen.getByRole("button", { name: "Copied to clipboard" })).toBeDefined();
  });

  it("lets an aria-label from the caller override the machine's name", () => {
    render(clipped(<Trigger aria-label="Copy the link">⧉</Trigger>));

    expect(screen.getByRole("button", { name: "Copy the link" })).toBeDefined();
  });

  it("takes its idle name from the translations set on the root", () => {
    render(
      clipped(<Trigger>⧉</Trigger>, {
        translations: { triggerLabel: (copied) => (copied ? "Klaar" : "Kopieer") },
      }),
    );

    expect(screen.getByRole("button", { name: "Kopieer" })).toBeDefined();
  });

  it("takes its copied name from the translations set on the root", async () => {
    render(
      clipped(<Trigger>⧉</Trigger>, {
        translations: { triggerLabel: (copied) => (copied ? "Klaar" : "Kopieer") },
      }),
    );
    await pressed(screen.getByRole("button"));

    expect(screen.getByRole("button", { name: "Klaar" })).toBeDefined();
  });

  it("sets the type attribute to button", () => {
    render(clipped(<Trigger>⧉</Trigger>));

    expect(screen.getByRole("button").getAttribute("type")).toBe("button");
  });

  it("writes the root's value to the system clipboard when clicked", async () => {
    render(clipped(<Trigger>⧉</Trigger>));
    await pressed(screen.getByRole("button"));

    await expect(navigator.clipboard.readText()).resolves.toBe(LINK);
  });

  it("calls an onClick handler the caller passes", async () => {
    const heard = vi.fn<() => void>();

    render(clipped(<Trigger onClick={heard}>⧉</Trigger>));
    await pressed(screen.getByRole("button"));

    expect(heard).toHaveBeenCalledOnce();
  });

  it("still copies when the caller passes an onClick handler of its own", async () => {
    render(clipped(<Trigger onClick={vi.fn<() => void>()}>⧉</Trigger>));
    await pressed(screen.getByRole("button"));

    expect(screen.getByRole("button").dataset["copied"]).toBe("");
  });

  it("carries the button recipe's classes when rendered as the icon button", () => {
    const { container } = render(
      clipped(
        <PropsProvider value={{ size: "sm", variant: "ghost" }}>
          <Trigger as={IconButton}>⧉</Trigger>
        </PropsProvider>,
      ),
    );

    const trigger = slotElement(container, "clipboard", "trigger");

    expect(trigger.classList.contains("button")).toBe(true);
    expect(trigger.classList.contains("button--ghost")).toBe(true);
    expect(trigger.classList.contains("button--sm")).toBe(true);
  });

  it("keeps copying when rendered as the icon button", async () => {
    const { container } = render(
      clipped(
        <PropsProvider value={{ size: "sm", variant: "ghost" }}>
          <Trigger as={IconButton}>⧉</Trigger>
        </PropsProvider>,
      ),
    );
    await pressed(screen.getByRole("button"));

    expect(slotElement(container, "clipboard", "trigger").dataset["copied"]).toBe("");
  });
});
