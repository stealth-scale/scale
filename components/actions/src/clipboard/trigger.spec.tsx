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

  it("defaults its accessible name to Copy to clipboard", () => {
    render(clipped(<Trigger>⧉</Trigger>));

    expect(screen.getByRole("button", { name: "Copy to clipboard" })).toBeDefined();
  });

  it("defaults its accessible name to Copied to clipboard after a copy", async () => {
    render(clipped(<Trigger>⧉</Trigger>));
    await pressed(screen.getByRole("button"));

    expect(screen.getByRole("button", { name: "Copied to clipboard" })).toBeDefined();
  });

  it("uses an aria-label passed by the caller over both names", () => {
    render(clipped(<Trigger aria-label="Copy the link">⧉</Trigger>));

    expect(screen.getByRole("button", { name: "Copy the link" })).toBeDefined();
  });

  it("takes its idle name from label", () => {
    render(
      clipped(
        <Trigger copiedLabel="Klaar" label="Kopieer">
          ⧉
        </Trigger>,
      ),
    );

    expect(screen.getByRole("button", { name: "Kopieer" })).toBeDefined();
  });

  it("takes its copied name from copiedLabel after a copy", async () => {
    render(
      clipped(
        <Trigger copiedLabel="Klaar" label="Kopieer">
          ⧉
        </Trigger>,
      ),
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

  it("copies when the caller also passes onClick", async () => {
    render(clipped(<Trigger onClick={vi.fn<() => void>()}>⧉</Trigger>));
    await pressed(screen.getByRole("button"));

    expect(screen.getByRole("button").dataset["copied"]).toBe("");
  });

  it("applies the button recipe classes when rendered as IconButton", () => {
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

  it("copies when rendered as IconButton", async () => {
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
