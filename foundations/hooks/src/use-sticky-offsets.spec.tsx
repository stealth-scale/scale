import { type ReactElement, useRef } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useStickyOffsets } from "#use-sticky-offsets.ts";

const OPTIONS = { bands: "[data-band]", offset: "--band-offset", total: "--stuck-height" };

const ABSENT = undefined;

interface Observed {
  disconnected: () => boolean;
  measure: () => void;
  observed: () => number;
  restore: () => void;
}

function stubObserver(): Observed {
  const held = { callback: (): void => undefined, count: 0, disconnected: false };

  class Stub {
    constructor(callback: () => void) {
      held.callback = callback;
    }

    disconnect(): void {
      held.disconnected = true;
    }

    observe(): void {
      held.count += 1;
    }

    unobserve(): void {
      held.count -= 1;
    }
  }

  vi.stubGlobal("ResizeObserver", Stub);

  return {
    disconnected: () => held.disconnected,
    measure: () => {
      held.callback();
    },
    observed: () => held.count,
    restore: () => {
      vi.unstubAllGlobals();
    },
  };
}

function Column({
  heights,
  measuring,
  options = OPTIONS,
}: {
  heights: readonly number[];
  measuring: boolean;
  options?: typeof OPTIONS;
}): ReactElement {
  const column = useRef<HTMLDivElement>(null);

  useStickyOffsets(column, measuring, options);

  return (
    <div data-testid="column" ref={column}>
      {heights.map((height, index) => (
        <div
          data-band=""
          data-testid={`band-${String(index)}`}
          key={height}
          ref={(element) => {
            if (element === null) return;

            Object.defineProperty(element, "getBoundingClientRect", {
              configurable: true,
              value: () => ({ height }),
            });
          }}
        />
      ))}
    </div>
  );
}

function Loose(): null {
  useStickyOffsets(useRef<HTMLDivElement>(null), true, OPTIONS);

  return null;
}

describe("useStickyOffsets", () => {
  it("sets no offset on the first band", () => {
    const stub = stubObserver();
    const { getByTestId } = render(<Column heights={[40, 24]} measuring />);

    stub.measure();

    expect(getByTestId("band-0").style.getPropertyValue(OPTIONS.offset)).toBe("0px");
    stub.restore();
  });

  it("sets the height of the bands above it on a later band", () => {
    const stub = stubObserver();
    const { getByTestId } = render(<Column heights={[40, 24]} measuring />);

    stub.measure();

    expect(getByTestId("band-1").style.getPropertyValue(OPTIONS.offset)).toBe("40px");
    stub.restore();
  });

  it("sets the height of every band on the column", () => {
    const stub = stubObserver();
    const { getByTestId } = render(<Column heights={[40, 24]} measuring />);

    stub.measure();

    expect(getByTestId("column").style.getPropertyValue(OPTIONS.total)).toBe("64px");
    stub.restore();
  });

  it("observes the column and each band", () => {
    const stub = stubObserver();

    render(<Column heights={[40, 24]} measuring />);

    expect(stub.observed()).toBe(3);
    stub.restore();
  });

  it("observes nothing while measuring is false", () => {
    const stub = stubObserver();

    render(<Column heights={[40]} measuring={false} />);

    expect(stub.observed()).toBe(0);
    stub.restore();
  });

  it("sets nothing on the column while measuring is false", () => {
    const stub = stubObserver();
    const { getByTestId } = render(<Column heights={[40]} measuring={false} />);

    expect(getByTestId("column").style.getPropertyValue(OPTIONS.total)).toBe("");
    stub.restore();
  });

  it("sets a total of zero when the column contains no band", () => {
    const stub = stubObserver();
    const { getByTestId } = render(<Column heights={[]} measuring />);

    stub.measure();

    expect(getByTestId("column").style.getPropertyValue(OPTIONS.total)).toBe("0px");
    stub.restore();
  });

  it("disconnects the observer when the component unmounts", () => {
    const stub = stubObserver();
    const { unmount } = render(<Column heights={[40]} measuring />);

    unmount();

    expect(stub.disconnected()).toBe(true);
    stub.restore();
  });

  it("observes nothing while the column ref is empty", () => {
    const stub = stubObserver();

    render(<Loose />);

    expect(stub.observed()).toBe(0);
    stub.restore();
  });

  it("observes nothing where the environment has no ResizeObserver", () => {
    vi.stubGlobal("ResizeObserver", ABSENT);

    const { getByTestId } = render(<Column heights={[40]} measuring />);

    expect(getByTestId("column").style.getPropertyValue(OPTIONS.total)).toBe("");
    vi.unstubAllGlobals();
  });

  it("measures again when the band selector changes", () => {
    const stub = stubObserver();
    const { getByTestId, rerender } = render(<Column heights={[40]} measuring />);

    rerender(<Column heights={[40]} measuring options={{ ...OPTIONS, bands: "[data-other]" }} />);
    stub.measure();

    expect(getByTestId("column").style.getPropertyValue(OPTIONS.total)).toBe("0px");
    stub.restore();
  });

  it("writes the offset under a new property when the offset name changes", () => {
    const stub = stubObserver();
    const { getByTestId, rerender } = render(<Column heights={[40]} measuring />);

    rerender(<Column heights={[40]} measuring options={{ ...OPTIONS, offset: "--other" }} />);
    stub.measure();

    expect(getByTestId("band-0").style.getPropertyValue("--other")).toBe("0px");
    stub.restore();
  });

  it("writes the total under a new property when the total name changes", () => {
    const stub = stubObserver();
    const { getByTestId, rerender } = render(<Column heights={[40]} measuring />);

    rerender(<Column heights={[40]} measuring options={{ ...OPTIONS, total: "--other" }} />);
    stub.measure();

    expect(getByTestId("column").style.getPropertyValue("--other")).toBe("40px");
    stub.restore();
  });

  it("starts measuring when measuring turns true", () => {
    const stub = stubObserver();
    const { getByTestId, rerender } = render(<Column heights={[40]} measuring={false} />);

    rerender(<Column heights={[40]} measuring />);
    stub.measure();

    expect(getByTestId("column").style.getPropertyValue(OPTIONS.total)).toBe("40px");
    stub.restore();
  });

  it("rewires once for each option that changes in turn", () => {
    const stub = stubObserver();
    const { getByTestId, rerender } = render(<Column heights={[40]} measuring={false} />);

    rerender(<Column heights={[40]} measuring />);
    rerender(<Column heights={[40]} measuring options={{ ...OPTIONS, bands: "[data-other]" }} />);
    rerender(<Column heights={[40]} measuring options={{ ...OPTIONS, offset: "--a" }} />);
    rerender(<Column heights={[40]} measuring options={{ ...OPTIONS, total: "--b" }} />);
    stub.measure();

    expect(getByTestId("column").style.getPropertyValue("--b")).toBe("40px");
    stub.restore();
  });

  it("measures again when the column it is given changes", () => {
    const stub = stubObserver();

    function Swapping({ second }: { second: boolean }): ReactElement {
      const first = useRef<HTMLDivElement>(null);
      const other = useRef<HTMLDivElement>(null);

      useStickyOffsets(second ? other : first, true, OPTIONS);

      return (
        <div>
          <div data-testid="first" ref={first} />
          <div data-testid="second" ref={other} />
        </div>
      );
    }

    const { getByTestId, rerender } = render(<Swapping second={false} />);

    rerender(<Swapping second />);
    stub.measure();

    expect(getByTestId("second").style.getPropertyValue(OPTIONS.total)).toBe("0px");
    stub.restore();
  });
});
