import { act, fireEvent, renderHook, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed, laidOut, watched } from "#carousel/carousel.fixtures.tsx";
import { splitCarouselProps, useCarouselMachine } from "#carousel/machine.ts";

describe("machine", () => {
  it("starts the rotation once the machine leaves a state that ignored the start", async () => {
    const { container } = await drawn(composed({ autoplay: true }));
    const region = screen.getByRole("region");
    const scroller = slotElement(container, "carousel", "itemGroup");

    fireEvent.pointerEnter(region);
    await settled();
    fireEvent.focus(scroller);
    fireEvent.pointerLeave(region);
    await settled();
    fireEvent.blur(scroller);
    await settled();

    expect(scroller.getAttribute("aria-live")).toBe("off");
  });

  it("names the root's id after the caller's id in useCarouselMachine", async () => {
    const { result } = renderHook(() => useCarouselMachine({ id: "gallery", slideCount: 3 }));

    await settled();

    expect(result.current[0].getRootProps()["id"]).toBe("carousel:gallery");
  });

  it("generates an id without the caller's id in useCarouselMachine", async () => {
    const { result } = renderHook(() => useCarouselMachine({ slideCount: 3 }));

    await settled();

    expect(result.current[0].getRootProps()["id"]).toMatch(/^carousel:/u);
  });

  it("starts the rotation the options ask for", async () => {
    const { result } = renderHook(() => useCarouselMachine({ autoplay: true, slideCount: 3 }));

    await settled();

    expect(result.current[0].isPlaying).toBe(true);
  });

  it("stops the rotation once the options stop asking for it", async () => {
    const { rerender, result } = renderHook(
      (autoplay: boolean) => useCarouselMachine({ autoplay, slideCount: 3 }),
      { initialProps: true },
    );

    await settled();
    rerender(false);
    await settled();

    expect(result.current[0].isPlaying).toBe(false);
  });

  it("starts a drag while the scroller has focus", async () => {
    const { container } = await drawn(composed({ allowMouseDrag: true }));
    const scroller = slotElement(container, "carousel", "itemGroup");

    fireEvent.focus(scroller);
    await settled();
    fireEvent.mouseDown(scroller, { button: 0 });
    await settled();

    expect(scroller.dataset["dragging"]).toBe("");
  });

  it("leaves the page when an arrow key reaches a slide's content", async () => {
    laidOut();
    const report = watched();

    await drawn(composed());
    report([0]);
    act(() => {
      screen.getByRole("link", { hidden: true, name: "Ledger" }).focus();
    });
    await settled();
    fireEvent.keyDown(screen.getByRole("link", { hidden: true, name: "Ledger" }), {
      key: "ArrowRight",
    });
    await settled();

    expect(screen.getByText("1 / 5")).toBeDefined();
  });

  it("returns the machine's settings first from splitCarouselProps", () => {
    expect(splitCarouselProps({ className: "wide", loop: true, slideCount: 3 })[0]).toStrictEqual({
      loop: true,
      slideCount: 3,
    });
  });

  it("returns the element's props second from splitCarouselProps", () => {
    expect(splitCarouselProps({ className: "wide", loop: true, slideCount: 3 })[1]).toStrictEqual({
      className: "wide",
    });
  });

  it("drops translations from the settings splitCarouselProps returns", () => {
    expect(
      splitCarouselProps({ slideCount: 3, translations: { nextTrigger: "Next" } })[0],
    ).toStrictEqual({ slideCount: 3 });
  });
});
