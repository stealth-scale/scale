import { type ReactElement } from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, drawn, pressed } from "@stealthscale/testing-react";

import { coded, SOURCE } from "#code-block/code-block.fixtures.tsx";
import { Copy } from "#code-block/copy.tsx";

/**
 * Names the control in both states, so a case can read which one it is in.
 */
const WORDS = { triggerLabel: (copied: boolean): string => (copied ? "Copied" : "Copy") };

/**
 * Draws the control inside the panel it needs above it, holding the code the panel is given.
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
  it("draws the mark it is given at rest", async () => {
    const { container } = await drawn(copying());

    expect(container.textContent).toContain("copy");
  });

  it("draws a control a keyboard reaches", async () => {
    await drawn(copying());

    expect(screen.getByRole("button")).toBeDefined();
  });

  it("names the control with the words it is given", async () => {
    await drawn(copying());

    expect(screen.getByRole("button", { name: "Copy" })).toBeDefined();
  });

  it("copies the code the root holds rather than a value of its own", async () => {
    await drawn(copying());
    await pressed(screen.getByRole("button"));

    await expect(navigator.clipboard.readText()).resolves.toBe(SOURCE);
  });

  it("follows the code the root is given rather than one of its own", async () => {
    const other = "pnpm add @stealthscale/component-content";

    await drawn(copying(other));
    await pressed(screen.getByRole("button"));

    await expect(navigator.clipboard.readText()).resolves.toBe(other);
  });

  it("says so for a while after a press", async () => {
    await drawn(copying());
    await pressed(screen.getByRole("button"));

    expect(screen.getByRole("button", { name: "Copied" }).textContent).toContain("done");
  });

  it("breaks no accessibility rule", async () => {
    await expect(
      accessibilityViolations(Copy, {
        props: { children: <span>copy</span>, translations: WORDS },
        wrapper: (children) => coded(children),
      }),
    ).resolves.toStrictEqual([]);
  });
});
