import { describe, expect, it } from "vitest";

import { actionOf, type Offered, type Pressed } from "#composer/keys.ts";

/**
 * Builds a key press without modifiers.
 */
function press(key: string, held: Partial<Pressed> = {}): Pressed {
  return {
    altKey: false,
    ctrlKey: false,
    isComposing: false,
    key,
    metaKey: false,
    shiftKey: false,
    ...held,
  };
}

/**
 * Describes a composer that offers every key, with an empty textarea that sends on Enter.
 */
const ALL: Offered = { cancels: true, edits: true, empty: true, submitOn: "enter" };

describe("actionOf", () => {
  it.each([
    { held: {}, key: "Enter", label: "Enter", want: "submit" },
    { held: { shiftKey: true }, key: "Enter", label: "Shift+Enter", want: "none" },
    { held: {}, key: "Escape", label: "Escape", want: "cancel" },
    { held: {}, key: "ArrowUp", label: "ArrowUp", want: "edit" },
    { held: { shiftKey: true }, key: "ArrowUp", label: "Shift+ArrowUp", want: "none" },
    { held: { altKey: true }, key: "ArrowUp", label: "Alt+ArrowUp", want: "none" },
    { held: { ctrlKey: true }, key: "ArrowUp", label: "Ctrl+ArrowUp", want: "none" },
    { held: { metaKey: true }, key: "ArrowUp", label: "Cmd+ArrowUp", want: "none" },
    { held: {}, key: "a", label: "a letter", want: "none" },
  ] as const)("returns $want for $label", ({ held, key, want }) => {
    expect(actionOf(press(key, held), ALL)).toBe(want);
  });

  it("returns none for Enter while an input method composes", () => {
    expect(actionOf(press("Enter", { isComposing: true }), ALL)).toBe("none");
  });

  it("returns none for Escape when no reply is shown", () => {
    expect(actionOf(press("Escape"), { ...ALL, cancels: false })).toBe("none");
  });

  it("returns none for ArrowUp when nothing edits the last message", () => {
    expect(actionOf(press("ArrowUp"), { ...ALL, edits: false })).toBe("none");
  });

  it("returns none for ArrowUp when the textarea has text", () => {
    expect(actionOf(press("ArrowUp"), { ...ALL, empty: false })).toBe("none");
  });

  it.each([
    { held: { ctrlKey: true }, label: "Ctrl+Enter", want: "submit" },
    { held: { metaKey: true }, label: "Cmd+Enter", want: "submit" },
    { held: {}, label: "Enter", want: "none" },
  ] as const)("returns $want for $label under modEnter", ({ held, want }) => {
    expect(actionOf(press("Enter", held), { ...ALL, submitOn: "modEnter" })).toBe(want);
  });
});
