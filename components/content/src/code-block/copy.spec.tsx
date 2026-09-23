import { type ReactElement } from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, drawn, pressed } from "@stealthscale/testing-react";

import { coded, SOURCE } from "#code-block/code-block.fixtures.tsx";
import { Copy } from "#code-block/copy.tsx";

/**
 * Renders the control inside a root with the given code and a name for each state.
 */
function copying(code: string = SOURCE): ReactElement {
  return coded(
    <Copy copied={<span>done</span>} copiedLabel="Copied" label="Copy">
      <span>copy</span>
    </Copy>,
    { code },
  );
}

describe("Copy", () => {
  it("renders its children as the idle icon", async () => {
    const { container } = await drawn(copying());

    expect(container.textContent).toContain("copy");
  });

  it("renders its trigger with the button role", async () => {
    await drawn(copying());

    expect(screen.getByRole("button")).toBeDefined();
  });

  it("names the trigger from label", async () => {
    await drawn(copying());

    expect(screen.getByRole("button", { name: "Copy" })).toBeDefined();
  });

  it("writes the root's code to the clipboard when the trigger is pressed", async () => {
    await drawn(copying());
    await pressed(screen.getByRole("button"));

    await expect(navigator.clipboard.readText()).resolves.toBe(SOURCE);
  });

  it("writes the code of the root it is rendered in", async () => {
    const other = "pnpm add @stealthscale/component-content";

    await drawn(copying(other));
    await pressed(screen.getByRole("button"));

    await expect(navigator.clipboard.readText()).resolves.toBe(other);
  });

  it("names the trigger from copiedLabel after a press", async () => {
    await drawn(copying());
    await pressed(screen.getByRole("button"));

    expect(screen.getByRole("button", { name: "Copied" })).toBeDefined();
  });

  it("renders the copied icon after a press", async () => {
    await drawn(copying());
    await pressed(screen.getByRole("button"));

    expect(screen.getByRole("button").textContent).toContain("done");
  });

  it("returns no accessibility violation inside a root", async () => {
    await expect(
      accessibilityViolations(Copy, {
        props: { children: <span>copy</span>, copiedLabel: "Copied", label: "Copy" },
        wrapper: (children) => coded(children),
      }),
    ).resolves.toStrictEqual([]);
  });
});
