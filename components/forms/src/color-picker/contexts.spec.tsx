import { type ReactElement, type ReactNode, useContext } from "react";

import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  InControl,
  SwatchValue,
  useAreaChannels,
  useSliderChannel,
  useSwatchValue,
} from "#color-picker/contexts.ts";

/**
 * Renders its children inside a swatch trigger's value, `#DC2626`.
 *
 * @param props - The children.
 * @returns The provider around the children.
 */
function Swatched({ children }: { readonly children: ReactNode }): ReactElement {
  return <SwatchValue value="#DC2626">{children}</SwatchValue>;
}

describe("contexts", () => {
  it("throws for an area part outside an area", () => {
    expect(() => renderHook(() => useAreaChannels())).toThrow(
      "A part of ColorPicker.Area was drawn outside the root that holds it together.",
    );
  });

  it("throws for a slider part outside a slider", () => {
    expect(() => renderHook(() => useSliderChannel())).toThrow(
      "A part of ColorPicker.ChannelSlider was drawn outside the root that holds it together.",
    );
  });

  it("returns a swatch's own value over its trigger's", () => {
    const { result } = renderHook(() => useSwatchValue("#2563EB"), { wrapper: Swatched });

    expect(result.current).toBe("#2563EB");
  });

  it("returns the trigger's value for a swatch without one", () => {
    const { result } = renderHook(() => useSwatchValue(), { wrapper: Swatched });

    expect(result.current).toBe("#DC2626");
  });

  it("throws for a swatch without a value outside a trigger", () => {
    expect(() => renderHook(() => useSwatchValue())).toThrow(
      "A ColorPicker swatch needs a value or a ColorPicker.SwatchTrigger around it.",
    );
  });

  it("reports a part outside the control by default", () => {
    const { result } = renderHook(() => useContext(InControl));

    expect(result.current).toBe(false);
  });
});
