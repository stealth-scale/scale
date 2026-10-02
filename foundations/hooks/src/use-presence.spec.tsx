import { type ReactElement } from "react";

import { act, type RenderResult, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { type PresenceOptions, usePresence } from "#use-presence.ts";

/**
 * Renders a panel through the hook, or nothing while the hook reports it unmounted.
 */
function Panel(options: PresenceOptions): null | ReactElement {
  const { props, setNode, unmounted } = usePresence(options);

  return unmounted ? null : <div ref={setNode} role="note" {...props} />;
}

/**
 * Returns the panel, or null while it is not rendered.
 */
function panel(): HTMLElement | null {
  return screen.queryByRole("note", { hidden: true });
}

/**
 * Renders the panel again with new options and waits for the machine to commit.
 */
async function rerendered(rendered: RenderResult, options: PresenceOptions): Promise<void> {
  await act(async () => {
    rendered.rerender(<Panel {...options} />);
    await Promise.resolve();
  });
}

/**
 * Waits for the next animation frame and for the machine to commit after it.
 */
async function frame(): Promise<void> {
  await act(async () => {
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
    await Promise.resolve();
  });
}

/**
 * Makes the panel's computed style report an exit animation of 200ms.
 */
function animated(): void {
  vi.spyOn(window, "getComputedStyle").mockReturnValue(
    Object.assign(document.createElement("div").style, {
      animationDuration: "0.2s",
      animationName: "scale-out",
      display: "block",
    }),
  );
}

describe("usePresence", () => {
  it("shows the element while present is true", async () => {
    await drawn(<Panel present />);

    expect(panel()?.hidden).toBe(false);
  });

  it("sets data-state to open while present is true", async () => {
    await drawn(<Panel present />);

    expect(panel()?.dataset["state"]).toBe("open");
  });

  it("sets data-state to closed once present turns false", async () => {
    const rendered = await drawn(<Panel present />);

    await rerendered(rendered, { present: false });

    expect(panel()?.dataset["state"]).toBe("closed");
  });

  it("hides the element one frame after present turns false", async () => {
    const rendered = await drawn(<Panel present />);

    await rerendered(rendered, { present: false });
    await frame();

    expect(panel()?.hidden).toBe(true);
  });

  it("renders nothing before the element first shows under lazyMount", async () => {
    await drawn(<Panel lazyMount present={false} />);

    expect(panel()).toBeNull();
  });

  it("renders the hidden element before it first shows without lazyMount", async () => {
    await drawn(<Panel present={false} />);

    expect(panel()?.hidden).toBe(true);
  });

  it("renders the element once it first shows under lazyMount", async () => {
    const rendered = await drawn(<Panel lazyMount present={false} />);

    await rerendered(rendered, { lazyMount: true, present: true });

    expect(panel()?.hidden).toBe(false);
  });

  it("renders nothing after an exit under unmountOnExit", async () => {
    const rendered = await drawn(<Panel present unmountOnExit />);

    await rerendered(rendered, { present: false, unmountOnExit: true });
    await frame();

    expect(panel()).toBeNull();
  });

  it("keeps the hidden element after an exit under lazyMount alone", async () => {
    const rendered = await drawn(<Panel lazyMount present />);

    await rerendered(rendered, { lazyMount: true, present: false });
    await frame();

    expect(panel()?.hidden).toBe(true);
  });

  it("leaves data-state unset on mount under skipAnimationOnMount", async () => {
    await drawn(<Panel present skipAnimationOnMount />);

    expect(panel()?.dataset["state"]).toBeUndefined();
  });

  it("calls onExitComplete once the element leaves", async () => {
    const done = vi.fn<() => void>();
    const rendered = await drawn(<Panel onExitComplete={done} present />);

    await rerendered(rendered, { onExitComplete: done, present: false });
    await frame();

    expect(done).toHaveBeenCalledOnce();
  });

  it("keeps the element shown until its exit animation ends", async () => {
    animated();

    const rendered = await drawn(<Panel present />);

    await rerendered(rendered, { present: false });
    await frame();

    expect(panel()?.hidden).toBe(false);
  });

  it("makes the element inert while its exit animation runs", async () => {
    animated();

    const rendered = await drawn(<Panel present />);

    await rerendered(rendered, { present: false });
    await frame();

    expect(panel()?.hasAttribute("inert")).toBe(true);
  });

  it("leaves the element without inert while present is true", async () => {
    await drawn(<Panel present />);

    expect(panel()?.hasAttribute("inert")).toBe(false);
  });

  it("hides the element when its exit animation ends", async () => {
    animated();

    const rendered = await drawn(<Panel present />);

    await rerendered(rendered, { present: false });
    await frame();
    await act(async () => {
      panel()?.dispatchEvent(new AnimationEvent("animationend", { animationName: "scale-out" }));
      await Promise.resolve();
    });

    expect(panel()?.hidden).toBe(true);
  });
});
