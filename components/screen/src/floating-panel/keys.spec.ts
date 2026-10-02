import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";

import { composed, keyed, panel, placed } from "#floating-panel/floating-panel.fixtures.tsx";
import { type RootProps } from "#floating-panel/index.ts";

/**
 * Place and size of the panel in every case unless the case states its own.
 */
const START: RootProps = {
  defaultOpen: true,
  defaultPosition: { x: 100, y: 100 },
  defaultSize: { height: 200, width: 300 },
};

describe("keyed", () => {
  it.each([
    { key: "ArrowRight", want: { x: 101, y: 100 } },
    { key: "ArrowLeft", want: { x: 99, y: 100 } },
    { key: "ArrowDown", want: { x: 100, y: 101 } },
    { key: "ArrowUp", want: { x: 100, y: 99 } },
  ])("moves the panel one pixel on $key", async ({ key, want }) => {
    await drawn(composed(START));
    await keyed(panel(), { key });

    expect({ x: placed().x, y: placed().y }).toStrictEqual(want);
  });

  it("moves the panel ten pixels with Shift", async () => {
    await drawn(composed(START));
    await keyed(panel(), { key: "ArrowRight", shiftKey: true });

    expect(placed().x).toBe(110);
  });

  it("multiplies the step by gridSize", async () => {
    await drawn(composed({ ...START, gridSize: 8 }));
    await keyed(panel(), { key: "ArrowDown" });

    expect(placed().y).toBe(108);
  });

  it("moves the panel left on ArrowLeft in a right-to-left panel", async () => {
    await drawn(composed({ ...START, dir: "rtl" }));
    await keyed(panel(), { key: "ArrowLeft" });

    expect(placed().x).toBe(99);
  });

  it("cancels an arrow key it handles", async () => {
    await drawn(composed(START));

    await expect(keyed(panel(), { key: "ArrowRight" })).resolves.toBe(false);
  });

  it("leaves a key other than an arrow alone", async () => {
    await drawn(composed(START));

    await expect(keyed(panel(), { key: "a" })).resolves.toBe(true);
  });

  it("leaves an arrow pressed in a field inside the panel alone", async () => {
    await drawn(composed(START));
    await keyed(screen.getByRole("textbox", { name: "Note" }), { key: "ArrowRight" });

    expect(placed().x).toBe(100);
  });

  it("leaves an arrow the caller cancelled alone", async () => {
    await drawn(
      composed(START, {
        onKeyDown: (event) => {
          event.preventDefault();
        },
      }),
    );
    await keyed(panel(), { key: "ArrowRight" });

    expect(placed().x).toBe(100);
  });

  it("keeps the panel in place when draggable is false", async () => {
    await drawn(composed({ ...START, draggable: false }));
    await keyed(panel(), { key: "ArrowRight" });

    expect(placed().x).toBe(100);
  });

  it.each([
    { key: "ArrowRight", want: { height: 200, width: 301 } },
    { key: "ArrowLeft", want: { height: 200, width: 299 } },
    { key: "ArrowDown", want: { height: 201, width: 300 } },
    { key: "ArrowUp", want: { height: 199, width: 300 } },
  ])("resizes the panel one pixel on Alt with $key", async ({ key, want }) => {
    await drawn(composed(START));
    await keyed(panel(), { altKey: true, key });

    expect({ height: placed().height, width: placed().width }).toStrictEqual(want);
  });

  it("resizes the panel ten pixels with Shift and Alt", async () => {
    await drawn(composed(START));
    await keyed(panel(), { altKey: true, key: "ArrowRight", shiftKey: true });

    expect(placed().width).toBe(310);
  });

  it("keeps the aspect ratio on Alt with ArrowRight when lockAspectRatio is true", async () => {
    await drawn(composed({ ...START, lockAspectRatio: true }));
    await keyed(panel(), { altKey: true, key: "ArrowRight", shiftKey: true });

    expect({ height: placed().height, width: placed().width }).toStrictEqual({
      height: 206.666_666_666_666_66,
      width: 310,
    });
  });

  it("keeps the aspect ratio on Alt with ArrowDown when lockAspectRatio is true", async () => {
    await drawn(composed({ ...START, lockAspectRatio: true }));
    await keyed(panel(), { altKey: true, key: "ArrowDown", shiftKey: true });

    expect({ height: placed().height, width: placed().width }).toStrictEqual({
      height: 210,
      width: 315,
    });
  });

  it("keeps the panel's place on Alt with an arrow", async () => {
    await drawn(composed(START));
    await keyed(panel(), { altKey: true, key: "ArrowLeft" });

    expect(placed().x).toBe(100);
  });

  it("keeps the size when resizable is false", async () => {
    await drawn(composed({ ...START, resizable: false }));
    await keyed(panel(), { altKey: true, key: "ArrowRight" });

    expect(placed().width).toBe(300);
  });

  it("keeps the size of a maximized panel", async () => {
    await drawn(composed(START));
    await pressed(screen.getByRole("button", { name: "Maximize" }));
    const { width } = placed();
    await keyed(panel(), { altKey: true, key: "ArrowLeft" });

    expect(placed().width).toBe(width);
  });
});
