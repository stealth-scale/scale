import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, pressed, settled } from "@stealthscale/testing-react";

import { FormatTrigger } from "#color-picker/format-trigger.tsx";
import { type FormatChangeDetails } from "#color-picker/machine.ts";
import { Root } from "#color-picker/root.tsx";

describe("FormatTrigger", () => {
  it("shows the format in force", async () => {
    await drawn(
      <Root defaultValue="#2563EB">
        <FormatTrigger />
      </Root>,
    );

    expect(screen.getByRole("button", { name: "RGB" })).toBeDefined();
  });

  it("moves the format from RGB to HSB on a press", async () => {
    const changed = vi.fn<(details: FormatChangeDetails) => void>();

    await drawn(
      <Root defaultValue="#2563EB" onFormatChange={changed}>
        <FormatTrigger />
      </Root>,
    );
    await pressed(screen.getByRole("button", { name: "RGB" }));
    await settled();

    expect(changed.mock.lastCall).toStrictEqual([{ format: "hsba" }]);
  });

  it("shows its children in place of the format", async () => {
    await drawn(
      <Root defaultValue="#2563EB">
        <FormatTrigger>Format</FormatTrigger>
      </Root>,
    );

    expect(screen.getByRole("button", { name: "Format" })).toBeDefined();
  });

  it("drops the machine's aria-label", async () => {
    await drawn(
      <Root defaultValue="#2563EB">
        <FormatTrigger />
      </Root>,
    );

    expect(screen.getByRole("button").hasAttribute("aria-label")).toBe(false);
  });
});
