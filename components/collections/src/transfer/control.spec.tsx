import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { withProvider } from "#transfer/context.ts";
import { Control, type ControlProps } from "#transfer/control.tsx";

/**
 * Draws the frame a control needs above it, which sets the variants it reads.
 */
const Framed = withProvider("div", "root");

/**
 * Draws one control inside the frame it needs.
 *
 * @param props - Whatever the case sets on the control.
 * @returns The frame, holding the control.
 */
function between(props: Omit<ControlProps, "children">): ReactElement {
  return (
    <Framed>
      <Control {...props}>{">"}</Control>
    </Framed>
  );
}

describe("Control", () => {
  it("draws a button", () => {
    const { container } = render(between({ label: "Take", onPress: vi.fn<() => void>() }));

    expect(slotElement(container, "transfer", "control").tagName).toBe("BUTTON");
  });

  it("submits nothing, because a pair of lists is not a form", () => {
    render(between({ label: "Take", onPress: vi.fn<() => void>() }));

    expect(screen.getByRole("button").getAttribute("type")).toBe("button");
  });

  it("names itself for a reader who cannot see which way it points", () => {
    render(between({ label: "Take what is picked", onPress: vi.fn<() => void>() }));

    expect(screen.getByRole("button", { name: "Take what is picked" })).toBeTruthy();
  });

  it("moves the rows when it is pressed", async () => {
    const moved = vi.fn<() => void>();

    render(between({ label: "Take", onPress: moved }));
    await pressed(screen.getByRole("button"));

    expect(moved).toHaveBeenCalledTimes(1);
  });

  it("moves nothing while it is off", async () => {
    const moved = vi.fn<() => void>();

    render(between({ disabled: true, label: "Take", onPress: moved }));
    await pressed(screen.getByRole("button"));

    expect(moved).not.toHaveBeenCalled();
  });
});
