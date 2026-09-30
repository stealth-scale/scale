import { type ReactElement, type ReactNode } from "react";

import { act } from "@testing-library/react";
import { vi } from "vitest";

import { charted } from "#chart/chart.fixtures.tsx";
import { Frame, Grid } from "#heat/grid.ts";

/**
 * Describes the resize observer the stub records: its callback, whether it disconnected and the
 * elements it observes.
 */
export interface Observed {
  readonly disconnected: () => boolean;
  readonly resize: () => void;
  readonly targets: () => readonly Element[];
}

/**
 * Replaces `ResizeObserver` with a stub that runs its callback on a resize only while it observes a
 * target, and reports whether it observes one and which.
 */
export function observed(): Observed {
  const state: { callback?: () => void; observing: boolean; targets: Element[] } = {
    observing: false,
    targets: [],
  };

  /**
   * Keeps the callback and whether a target is observed.
   */
  class Stub {
    /**
     * Keeps the callback.
     */
    constructor(callback: () => void) {
      state.callback = callback;
    }

    /**
     * Stops observing.
     */
    disconnect(): void {
      state.observing = false;
    }

    /**
     * Starts observing a target.
     */
    observe(target: Element): void {
      state.observing = true;
      state.targets.push(target);
    }
  }

  vi.stubGlobal("ResizeObserver", Stub);

  return {
    disconnected: () => !state.observing,
    resize: () => {
      act(() => {
        if (state.observing) state.callback?.();
      });
    },
    targets: () => state.targets,
  };
}

/**
 * Renders parts inside a chart's root and a heat grid's frame.
 */
export function framed(children: ReactNode): ReactElement {
  return charted({ children: <Frame>{children}</Frame> });
}

/**
 * Renders cells in a row of a grid inside a frame.
 */
export function rowed(children: ReactNode): ReactElement {
  return framed(
    <Grid aria-label="Cells">
      <tbody>
        <tr>{children}</tr>
      </tbody>
    </Grid>,
  );
}
