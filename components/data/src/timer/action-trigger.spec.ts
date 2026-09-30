import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";
import { slotClass } from "@stealthscale/testing-theme";

import { composed } from "#timer/timer.fixtures.tsx";

/**
 * Returns the trigger a name names, hidden or not.
 */
function trigger(name: string): HTMLElement {
  return screen.getByText(name);
}

/**
 * Returns the names of the triggers that show.
 */
function shown(): readonly string[] {
  return ["Start", "Pause", "Resume", "Reset", "Restart"].filter(
    (name) => trigger(name).hidden === false,
  );
}

/**
 * Makes a hidden button unfocusable, as Chromium does: the write that hides the focused button
 * blurs it, and `focus` on a hidden button does nothing.
 */
function blurredOnHide(): void {
  vi.spyOn(HTMLButtonElement.prototype, "setAttribute").mockImplementation(function hide(
    this: HTMLButtonElement,
    name: string,
    value: string,
  ) {
    Element.prototype.setAttribute.call(this, name, value);

    if (name === "hidden" && this === document.activeElement) this.blur();
  });
  vi.spyOn(HTMLButtonElement.prototype, "focus").mockImplementation(function focus(
    this: HTMLButtonElement,
    options?: FocusOptions,
  ) {
    if (this.hidden === false) HTMLElement.prototype.focus.call(this, options);
  });
}

describe("ActionTrigger", () => {
  it("renders the library Button with the timer's action trigger class", async () => {
    await drawn(composed());

    expect([...trigger("Start").classList]).toStrictEqual(
      expect.arrayContaining(["button", slotClass("timer", "actionTrigger")]),
    );
  });

  it("shows Start and Restart while the timer is idle", async () => {
    await drawn(composed());

    expect(shown()).toStrictEqual(["Start", "Restart"]);
  });

  it("shows Pause Reset and Restart while the timer runs", async () => {
    await drawn(composed({ autoStart: true }));

    expect(shown()).toStrictEqual(["Pause", "Reset", "Restart"]);
  });

  it("shows Resume Reset and Restart after a press on Pause", async () => {
    await drawn(composed({ autoStart: true }));
    await pressed(trigger("Pause"));

    expect(shown()).toStrictEqual(["Resume", "Reset", "Restart"]);
  });

  it("returns an idle timer to Start after a press on Reset", async () => {
    await drawn(composed({ autoStart: true }));
    await pressed(trigger("Pause"));
    await pressed(trigger("Reset"));

    expect(shown()).toStrictEqual(["Start", "Restart"]);
  });

  it("shows Pause Reset and Restart in the frame after a press on Restart", async () => {
    vi.useFakeTimers();

    try {
      await drawn(composed({ autoStart: true }));
      await pressed(trigger("Restart"));

      expect(shown()).toStrictEqual(["Pause", "Reset", "Restart"]);
    } finally {
      vi.useRealTimers();
    }
  });

  it("moves focus to Pause after a press on Start", async () => {
    await drawn(composed());
    act(() => {
      trigger("Start").focus();
    });
    await pressed(trigger("Start"));

    expect(document.activeElement).toBe(trigger("Pause"));
  });

  it("moves focus to Pause when the browser blurs Start as the machine hides it", async () => {
    await drawn(composed());
    act(() => {
      trigger("Start").focus();
    });
    blurredOnHide();
    await pressed(trigger("Start"));

    expect(document.activeElement).toBe(trigger("Pause"));
  });

  it("moves focus to Pause when a new startMs restarts the count while Start has focus", async () => {
    vi.useFakeTimers();

    try {
      const { rerender } = await drawn(composed({ countdown: true, startMs: 5000 }));

      act(() => {
        trigger("Start").focus();
      });
      blurredOnHide();
      rerender(composed({ countdown: true, startMs: 3000 }));
      await act(() => vi.advanceTimersByTimeAsync(100));

      expect(document.activeElement).toBe(trigger("Pause"));
    } finally {
      vi.useRealTimers();
    }
  });

  it("keeps focus on Restart after a press on Restart", async () => {
    await drawn(composed({ autoStart: true }));
    act(() => {
      trigger("Restart").focus();
    });
    await pressed(trigger("Restart"));

    expect(document.activeElement).toBe(trigger("Restart"));
  });

  it("leaves focus alone when a trigger without focus hides", async () => {
    await drawn(composed());
    act(() => {
      trigger("Restart").focus();
    });
    await pressed(trigger("Start"));

    expect(document.activeElement).toBe(trigger("Restart"));
  });

  it("moves focus to Start when a countdown completes while Pause has focus", async () => {
    vi.useFakeTimers();

    try {
      await drawn(composed({ autoStart: true, countdown: true, startMs: 1000 }));
      act(() => {
        trigger("Pause").focus();
      });
      await act(() => vi.advanceTimersByTimeAsync(1200));

      expect(document.activeElement).toBe(trigger("Start"));
    } finally {
      vi.useRealTimers();
    }
  });

  it("moves focus to Start when a countdown completes after the window loses focus", async () => {
    vi.useFakeTimers();

    try {
      await drawn(composed({ autoStart: true, countdown: true, startMs: 1000 }));
      act(() => {
        trigger("Pause").focus();
      });
      fireEvent.focusOut(trigger("Pause"));
      await act(() => vi.advanceTimersByTimeAsync(1200));

      expect(document.activeElement).toBe(trigger("Start"));
    } finally {
      vi.useRealTimers();
    }
  });
});
