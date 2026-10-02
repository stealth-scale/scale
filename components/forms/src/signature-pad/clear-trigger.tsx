/**
 * Renders the button that clears a signature.
 *
 * @remarks
 *   The element is the input group's square button, placed in the control's top end corner, with
 *   the caller's glyph. `label` names it. The machine hides it while nothing is drawn and while a
 *   stroke is being drawn, and a read-only pad hides it. A press on it draws no stroke. After a
 *   press the strokes are gone and the button is hidden, so focus moves to the control.
 */

import { type ComponentProps, type MouseEvent, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { idOf, refocus } from "#file-upload/focus.ts";
import { withContext } from "#signature-pad/context.ts";
import { useSignaturePad } from "#signature-pad/machine.ts";
import { useShared } from "#signature-pad/state.ts";

/**
 * Renders the `button` with the signature pad's clear trigger class.
 */
const Cleared = withContext("button", "clearTrigger");

/**
 * Describes the props of the clear trigger: its name and the props of a `button`.
 */
export interface ClearTriggerProps extends ComponentProps<typeof Cleared> {
  /**
   * Accessible name of the button. Defaults to `Clear signature`.
   */
  readonly label?: string | undefined;
}

/**
 * Renders the clear trigger with the machine's props and its name.
 *
 * @param props - The name and the props of the `button`, merged over the machine's.
 * @returns The `button` element.
 */
export function ClearTrigger({
  label = "Clear signature",
  ...props
}: ClearTriggerProps): ReactElement {
  const api = useSignaturePad();
  const { readOnly } = useShared();

  /**
   * Moves focus to the control once the strokes are gone and this button is hidden.
   */
  function cleared(event: MouseEvent<HTMLButtonElement>): void {
    if (!event.defaultPrevented) refocus([idOf(api.getControlProps())]);
  }

  return (
    <Cleared
      {...mergeProps(
        api.getClearTriggerProps(),
        { "aria-label": label, onClick: cleared },
        readOnly ? { hidden: true } : {},
        props,
      )}
    />
  );
}
