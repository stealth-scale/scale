import { act, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, drawn, pressed } from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement } from "@stealthscale/testing-theme";

import { recipe } from "#timer/recipe.ts";
import { type RootProps } from "#timer/root.tsx";
import { composed } from "#timer/timer.fixtures.tsx";

/**
 * Advances the fake clock one frame at a time until the area's name is the given words, for at
 * most ten seconds.
 */
async function until(words: string, frames = 625): Promise<void> {
  if (frames === 0 || screen.getByRole("timer").getAttribute("aria-label") === words) return;

  await act(() => vi.advanceTimersByTimeAsync(16));
  await until(words, frames - 1);
}

describe("Root", () => {
  it("returns no accessibility violation", async () => {
    await expect(
      accessibilityViolations(() => composed({ countdown: true, startMs: 125_000 })),
    ).resolves.toStrictEqual([]);
  });

  it("applies the class of every value its recipe offers", async () => {
    await expect(
      boundMachineViolations(
        recipe,
        async (props: RootProps) => (await drawn(composed(props))).container,
        { slot: "root" },
      ),
    ).resolves.toStrictEqual([]);
  });

  it("sets data-recipe to timer", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "timer", "root").dataset["recipe"]).toBe("timer");
  });

  it("passes its size to the buttons", async () => {
    await drawn(composed({ size: "lg" }));

    expect(screen.getByRole("button", { name: "Start" }).className).toContain("button--lg");
  });

  it("passes its palette to the buttons", async () => {
    await drawn(composed({ palette: "success" }));

    expect(screen.getByRole("button", { name: "Start" }).className).toContain("button--success");
  });

  it("starts the count on mount when autoStart is true", async () => {
    await drawn(composed({ autoStart: true }));

    expect(screen.getByRole("button", { name: "Pause" }).hidden).toBe(false);
  });

  it("calls onTick with the count after each interval", async () => {
    vi.useFakeTimers();

    try {
      const told = vi.fn<(details: { readonly value: number }) => void>();

      await drawn(composed({ autoStart: true, onTick: told }));
      await act(() => vi.advanceTimersByTimeAsync(1100));

      expect(told).toHaveBeenLastCalledWith(expect.objectContaining({ value: 1000 }));
    } finally {
      vi.useRealTimers();
    }
  });

  it("calls onTick with the start count in the frame after a press on Restart", async () => {
    vi.useFakeTimers();

    try {
      const told = vi.fn<(details: { readonly value: number }) => void>();

      await drawn(composed({ autoStart: true, onTick: told, startMs: 5000 }));
      await act(() => vi.advanceTimersByTimeAsync(1100));
      await pressed(screen.getByRole("button", { name: "Restart" }));

      expect(told).toHaveBeenLastCalledWith(expect.objectContaining({ value: 5000 }));
    } finally {
      vi.useRealTimers();
    }
  });

  it("calls onComplete in the frame a countdown shows zero", async () => {
    vi.useFakeTimers();

    try {
      const told = vi.fn<() => void>();

      await drawn(composed({ autoStart: true, countdown: true, onComplete: told, startMs: 2000 }));
      await until("0 seconds");

      expect(told).toHaveBeenCalledExactlyOnceWith();
    } finally {
      vi.useRealTimers();
    }
  });

  it("shows Start in the frame a countdown shows zero", async () => {
    vi.useFakeTimers();

    try {
      await drawn(composed({ autoStart: true, countdown: true, startMs: 2000 }));
      await until("0 seconds");

      expect(screen.getByRole("button", { name: "Start" }).hidden).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });

  it("leaves onTick uncalled for a reset while paused", async () => {
    vi.useFakeTimers();

    try {
      const told = vi.fn<(details: { readonly value: number }) => void>();

      await drawn(composed({ autoStart: true, onTick: told }));
      await act(() => vi.advanceTimersByTimeAsync(1100));
      await pressed(screen.getByRole("button", { name: "Pause" }));
      await pressed(screen.getByRole("button", { name: "Reset" }));

      expect(told).toHaveBeenCalledTimes(1);
    } finally {
      vi.useRealTimers();
    }
  });
});
