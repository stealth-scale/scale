import { type ReactElement } from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, drawn, pressed } from "@stealthscale/testing-react";

import { coded, SOURCE } from "#code-block/code-block.fixtures.tsx";
import { Copy } from "#code-block/copy.tsx";

/**
 * Trigger labels for both states, so a case can tell which state the control is in.
 */
const WORDS = { triggerLabel: (copied: boolean): string => (copied ? "Copied" : "Copy") };

/**
 * Renders the control inside a root carrying the given code.
 */
function copying(code: string = SOURCE): ReactElement {
  return coded(
    <Copy copied={<span>done</span>} translations={WORDS}>
      <span>copy</span>
    </Copy>,
    { code },
  );
}

describe("Copy", () => {
  it("renders its children as the glyph before any press", async () => {
    const { container } = await drawn(copying());

    expect(container.textContent).toContain("copy");
  });

  it("renders its trigger with the button role", async () => {
    await drawn(copying());

    expect(screen.getByRole("button")).toBeDefined();
  });

  it("labels the trigger from the translations it is given", async () => {
    await drawn(copying());

    expect(screen.getByRole("button", { name: "Copy" })).toBeDefined();
  });

  it("writes the root's code to the clipboard when the trigger is pressed", async () => {
    await drawn(copying());
    await pressed(screen.getByRole("button"));

    await expect(navigator.clipboard.readText()).resolves.toBe(SOURCE);
  });

  it("writes whatever code the root holds rather than a value fixed in the component", async () => {
    const other = "pnpm add @stealthscale/component-content";

    await drawn(copying(other));
    await pressed(screen.getByRole("button"));

    await expect(navigator.clipboard.readText()).resolves.toBe(other);
  });

  it("relabels the trigger for the copied state after a press", async () => {
    await drawn(copying());
    await pressed(screen.getByRole("button"));

    expect(screen.getByRole("button", { name: "Copied" })).toBeDefined();
  });

  it("swaps in the copied glyph after a press", async () => {
    await drawn(copying());
    await pressed(screen.getByRole("button"));

    expect(screen.getByRole("button").textContent).toContain("done");
  });

  it("reports no axe violation when rendered inside a root", async () => {
    await expect(
      accessibilityViolations(Copy, {
        props: { children: <span>copy</span>, translations: WORDS },
        wrapper: (children) => coded(children),
      }),
    ).resolves.toStrictEqual([]);
  });
});
