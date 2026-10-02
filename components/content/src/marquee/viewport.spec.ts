import { fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed, copies } from "#marquee/marquee.fixtures.tsx";

describe("Viewport", () => {
  it("renders a div with the viewport class", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "marquee", "viewport").tagName).toBe("DIV");
  });

  it("calls onLoopComplete when the first copy finishes a loop", async () => {
    const looped = vi.fn<() => void>();

    await drawn(composed({ onLoopComplete: looped }));
    fireEvent.animationIteration(copies()[0] ?? document.body);

    expect(looped).toHaveBeenCalledTimes(1);
  });

  it("calls onComplete when the first copy finishes its last loop", async () => {
    const completed = vi.fn<() => void>();

    await drawn(composed({ loopCount: 2, onComplete: completed }));
    fireEvent.animationEnd(copies()[0] ?? document.body);

    expect(completed).toHaveBeenCalledTimes(1);
  });

  it("leaves a clone's loop unreported", async () => {
    const looped = vi.fn<() => void>();

    await drawn(composed({ onLoopComplete: looped }));
    fireEvent.animationIteration(copies()[1] ?? document.body);

    expect(looped).not.toHaveBeenCalled();
  });
});
