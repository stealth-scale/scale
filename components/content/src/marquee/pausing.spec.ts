import { act, fireEvent, renderHook, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { composed, region } from "#marquee/marquee.fixtures.tsx";
import { usePausing } from "#marquee/pausing.ts";

/**
 * Returns whether the machine holds the marquee.
 */
function held(): string | undefined {
  return region().dataset["paused"];
}

/**
 * Returns the pause control.
 */
function control(): HTMLElement {
  return screen.getByRole("button", { name: /^(?:Pause|Play)$/u });
}

describe("usePausing", () => {
  it("starts playing when defaultPaused is absent", () => {
    const { result } = renderHook(() => usePausing({}));

    expect([result.current.chosen, result.current.paused]).toStrictEqual([false, false]);
  });

  it("starts paused with defaultPaused", () => {
    const { result } = renderHook(() => usePausing({ defaultPaused: true }));

    expect(result.current.paused).toBe(true);
  });

  it("reverses the reader's choice on toggle", () => {
    const { result } = renderHook(() => usePausing({}));

    act(() => {
      result.current.toggle();
    });

    expect([result.current.chosen, result.current.paused]).toStrictEqual([true, true]);
  });

  it("calls onPauseChange with the reader's new choice", () => {
    const told = vi.fn<(details: { readonly paused: boolean }) => void>();
    const { result } = renderHook(() => usePausing({ onPauseChange: told }));

    act(() => {
      result.current.toggle();
    });

    expect(told).toHaveBeenLastCalledWith({ paused: true });
  });

  it("keeps a controlled choice until the caller changes it", () => {
    const { result } = renderHook(() => usePausing({ paused: false }));

    act(() => {
      result.current.toggle();
    });

    expect(result.current.chosen).toBe(false);
  });

  it("pauses while the pointer is over the marquee under pauseOnInteraction", async () => {
    await drawn(composed({ pauseOnInteraction: true }));
    fireEvent.pointerEnter(region());
    await settled();

    expect(held()).toBe("");
  });

  it("plays again once the pointer leaves", async () => {
    await drawn(composed({ pauseOnInteraction: true }));
    fireEvent.pointerEnter(region());
    await settled();
    fireEvent.pointerLeave(region());
    await settled();

    expect(held()).toBeUndefined();
  });

  it("keeps playing under the pointer without pauseOnInteraction", async () => {
    await drawn(composed());
    fireEvent.pointerEnter(region());
    await settled();

    expect(held()).toBeUndefined();
  });

  it("pauses while focus is inside the marquee under pauseOnInteraction", async () => {
    await drawn(composed({ pauseOnInteraction: true }));
    fireEvent.focus(control());
    await settled();

    expect(held()).toBe("");
  });

  it("keeps the pause while focus moves inside the marquee", async () => {
    await drawn(composed({ pauseOnInteraction: true }));
    fireEvent.focus(control());
    fireEvent.blur(control(), { relatedTarget: region() });
    await settled();

    expect(held()).toBe("");
  });

  it("plays again once focus leaves the marquee", async () => {
    await drawn(composed({ pauseOnInteraction: true }));
    fireEvent.focus(control());
    fireEvent.blur(control(), { relatedTarget: document.body });
    await settled();

    expect(held()).toBeUndefined();
  });

  it("keeps the reader's pause when the pointer leaves", async () => {
    await drawn(composed({ pauseOnInteraction: true }));
    fireEvent.pointerEnter(region());
    fireEvent.click(control());
    fireEvent.pointerLeave(region());
    await settled();

    expect(held()).toBe("");
  });
});
