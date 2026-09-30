import { type ReactElement, useState } from "react";

import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { inputTypeOf, useCaret } from "#caret.ts";

/**
 * Renders an input that upper-cases every edit and puts the caret at position 1.
 */
function Shouting(): ReactElement {
  const [value, setValue] = useState("");
  const place = useCaret();

  return (
    <input
      aria-label="Shout"
      onChange={(event) => {
        place(event.currentTarget, 1);
        setValue(event.currentTarget.value.toUpperCase());
      }}
      value={value}
    />
  );
}

describe("caret", () => {
  it("returns the input type of an input event", () => {
    expect(inputTypeOf(new InputEvent("input", { inputType: "insertText" }))).toBe("insertText");
  });

  it("returns nothing for an event without an input type", () => {
    expect(inputTypeOf(new Event("input"))).toBeUndefined();
  });

  it("places the caret once the value renders while the input has focus", () => {
    render(<Shouting />);
    const input = screen.getByRole<HTMLInputElement>("textbox");

    act(() => {
      input.focus();
    });
    fireEvent.change(input, { target: { value: "abc" } });

    expect([input.value, input.selectionStart]).toStrictEqual(["ABC", 1]);
  });

  it("leaves the caret of an input without focus", () => {
    render(<Shouting />);
    const input = screen.getByRole<HTMLInputElement>("textbox");

    fireEvent.change(input, { target: { value: "abc" } });

    expect(input.selectionStart).toBe(3);
  });
});
