import { renderToString } from "react-dom/server";

import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, pressed, settled } from "@stealthscale/testing-react";

import { hiddenOf } from "#color-picker/color-picker.fixtures.tsx";
import { EyeDropperTrigger } from "#color-picker/eye-dropper-trigger.tsx";
import { Root } from "#color-picker/root.tsx";

/**
 * Stands in for the browser's EyeDropper, which picks red.
 */
class Dropper {
  /**
   * Resolves with the color a person picks.
   *
   * @returns A promise of the picked color in hex.
   */
  open(): Promise<{ sRGBHex: string }> {
    return Promise.resolve({ sRGBHex: "#dc2626" });
  }
}

describe("EyeDropperTrigger", () => {
  it("renders nothing where the browser has no EyeDropper", async () => {
    await drawn(
      <Root defaultValue="#2563EB">
        <EyeDropperTrigger />
      </Root>,
    );

    expect(screen.queryByRole("button")).toBeNull();
  });

  it("renders nothing on the server", () => {
    expect(
      renderToString(
        <Root defaultValue="#2563EB">
          <EyeDropperTrigger />
        </Root>,
      ),
    ).not.toContain("button");
  });

  it("renders a button named Pick a color from the screen where the browser has one", async () => {
    vi.stubGlobal("EyeDropper", Dropper);
    await drawn(
      <Root defaultValue="#2563EB">
        <EyeDropperTrigger />
      </Root>,
    );

    expect(screen.getByRole("button", { name: "Pick a color from the screen" })).toBeDefined();
  });

  it("takes the name passed as label", async () => {
    vi.stubGlobal("EyeDropper", Dropper);
    await drawn(
      <Root defaultValue="#2563EB">
        <EyeDropperTrigger label="Pipette" />
      </Root>,
    );

    expect(screen.getByRole("button", { name: "Pipette" })).toBeDefined();
  });

  it("sets the color the eye dropper picks", async () => {
    vi.stubGlobal("EyeDropper", Dropper);

    const { container } = await drawn(
      <Root defaultValue="#2563EB">
        <EyeDropperTrigger />
      </Root>,
    );

    await pressed(screen.getByRole("button"));
    await settled();

    expect(hiddenOf(container).value).toBe("rgba(220, 38, 38, 1)");
  });
});
