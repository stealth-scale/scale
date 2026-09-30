/**
 * Renders the carousels the part specifications test, lays their slides out side by side, and
 * reports which slides are in view.
 */

import { type ReactElement } from "react";

import { act } from "@testing-library/react";
import { vi } from "vitest";

import * as Carousel from "#carousel/index.ts";

/**
 * Names of the slides every fixture renders.
 */
export const SLIDES = ["Ledger", "Payouts", "Exports", "Archive", "Queries"];

/**
 * Side of the scroller and of each slide, in pixels.
 */
const SIDE = 300;

/**
 * Renders a carousel of five slides with every control: the rotation control, the triggers, the
 * dots and the progress text.
 *
 * @param props - The props the case sets on the root.
 * @returns The carousel.
 */
export function composed(props: Partial<Carousel.RootProps> = {}): ReactElement {
  return (
    <Carousel.Root aria-label="Pictures" slideCount={SLIDES.length} {...props}>
      <Carousel.ItemGroup>
        {SLIDES.map((slide, index) => (
          <Carousel.Item index={index} key={slide}>
            <a href={`#${slide}`}>{slide}</a>
          </Carousel.Item>
        ))}
      </Carousel.ItemGroup>
      <Carousel.Control>
        <Carousel.AutoplayTrigger>
          <Carousel.AutoplayIndicator pause="Pause" play="Play" />
        </Carousel.AutoplayTrigger>
        <Carousel.PrevTrigger>Back</Carousel.PrevTrigger>
        <Carousel.IndicatorGroup>
          <Carousel.Indicators />
        </Carousel.IndicatorGroup>
        <Carousel.NextTrigger>On</Carousel.NextTrigger>
        <Carousel.ProgressText />
      </Carousel.Control>
    </Carousel.Root>
  );
}

/**
 * Lays the slides out one after the other along the carousel's axis, each as large as the scroller.
 *
 * @remarks
 *   Happy-dom lays out nothing, so the machine finds one snap point. The stub gives every slide a
 *   box one scroller further along the axis and the scroller a scroll size of five slides, so the
 *   machine counts five pages. The shared test preset restores the spies after every case.
 * @param orientation - The axis the slides follow.
 */
export function laidOut(orientation: "horizontal" | "vertical" = "horizontal"): void {
  const across = orientation === "horizontal";

  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function boxed(
    this: HTMLElement,
  ): DOMRect {
    const start = this.dataset["part"] === "item" ? Number(this.dataset["index"]) * SIDE : 0;

    return DOMRect.fromRect({
      height: SIDE,
      width: SIDE,
      x: across ? start : 0,
      y: across ? 0 : start,
    });
  });
  vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(SIDE);
  vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(SIDE);
  vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockReturnValue(
    across ? SIDE * SLIDES.length : SIDE,
  );
  vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockReturnValue(
    across ? SIDE : SIDE * SLIDES.length,
  );
}

/**
 * Replaces `IntersectionObserver` with a stub whose callback a case runs by hand.
 *
 * @remarks
 *   The shared test preset unstubs globals after every case.
 * @returns The function that reports the slides of the given indexes as in view and every other
 *   slide as out of view.
 */
export function watched(): (indexes: readonly number[]) => void {
  const held: { callback?: IntersectionObserverCallback; targets: HTMLElement[] } = {
    targets: [],
  };

  /**
   * Replaces `IntersectionObserver`, keeping its callback and its targets.
   */
  class Stub {
    /**
     * Keeps the callback the observer runs on a change of intersection.
     *
     * @param callback - The callback.
     */
    constructor(callback: IntersectionObserverCallback) {
      held.callback = callback;
    }

    /**
     * Accepts the end of observation, as the real observer does.
     */
    disconnect(): void {
      held.targets = [];
    }

    /**
     * Keeps an observed slide.
     *
     * @param target - The slide.
     */
    observe(target: HTMLElement): void {
      held.targets.push(target);
    }
  }

  vi.stubGlobal("IntersectionObserver", Stub);

  return (indexes) => {
    const entries = held.targets.map((target) => ({
      isIntersecting: indexes.includes(Number(target.dataset["index"])),
      target,
    }));

    act(() => {
      // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the machine reads isIntersecting and target, which each entry contains
      held.callback?.(
        entries as unknown as IntersectionObserverEntry[],
        {} as IntersectionObserver,
      );
    });
  };
}
