/**
 * Places the caret of a text input that rewrites what a person types, and reads the kind of edit.
 *
 * @remarks
 *   An input that formats every edit sets a value React writes after the change, and the browser
 *   then puts the caret at the end. The caret is placed again in a layout effect after the render
 *   that shows the value, and only while the input has focus, so a value set from elsewhere never
 *   moves focus. The input mask and the phone input share both.
 */

import { useState } from "react";

import { useSafeLayoutEffect } from "@stealthscale/hooks";

/**
 * Describes where the caret goes after an edit, and in which input.
 */
interface Caret {
  /**
   * Caret position in the value the input shows after the edit.
   */
  readonly at: number;

  /**
   * Input the edit happened in.
   */
  readonly input: HTMLInputElement;
}

/**
 * Returns the `inputType` of an input event, or nothing for an event without one.
 */
export function inputTypeOf(event: Event): string | undefined {
  return "inputType" in event && typeof event.inputType === "string" ? event.inputType : undefined;
}

/**
 * Returns a function that places an input's caret once the value its edit set renders.
 */
export function useCaret(): (input: HTMLInputElement, at: number) => void {
  const [caret, setCaret] = useState<Caret>();

  useSafeLayoutEffect(() => {
    if (caret === undefined || caret.input.ownerDocument.activeElement !== caret.input) return;

    caret.input.setSelectionRange(caret.at, caret.at);
  }, [caret]);

  return (input, at) => {
    setCaret({ at, input });
  };
}
