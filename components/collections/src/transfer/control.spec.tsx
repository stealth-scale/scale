import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { withProvider } from "#transfer/context.ts";
import { Control, type ControlProps } from "#transfer/control.tsx";

/**
 * Renders the root `div` that provides the variants.
 */
const Framed = withProvider("div", "root");

/**
 * Renders one control inside the root with the props the case sets.
 *
 * @param props - The props the case sets, without the mark.
 * @returns The root with the control inside it.
 */
function between(props: Omit<ControlProps, "children">): ReactElement {
  return (
    <Framed>
      <Control {...props}>{">"}</Control>
    </Framed>
  );
}

describe("Control", () => {
  it("renders a button", () => {
    const { container } = render(between({ label: "Take", onPress: vi.fn<() => void>() }));

    expect(slotElement(container, "transfer", "control").tagName).toBe("BUTTON");
  });

  it("sets type button", () => {
    render(between({ label: "Take", onPress: vi.fn<() => void>() }));

    expect(screen.getByRole("button").getAttribute("type")).toBe("button");
  });

  it("names the button by label", () => {
    render(between({ label: "Take what is picked", onPress: vi.fn<() => void>() }));

    expect(screen.getByRole("button", { name: "Take what is picked" })).toBeTruthy();
  });

  it("calls onPress on a press", async () => {
    const moved = vi.fn<() => void>();

    render(between({ label: "Take", onPress: moved }));
    await pressed(screen.getByRole("button"));

    expect(moved).toHaveBeenCalledTimes(1);
  });

  it("calls no onPress while disabled", async () => {
    const moved = vi.fn<() => void>();

    render(between({ disabled: true, label: "Take", onPress: moved }));
    await pressed(screen.getByRole("button"));

    expect(moved).not.toHaveBeenCalled();
  });
});
