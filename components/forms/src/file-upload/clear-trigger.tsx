/**
 * Renders the button that removes every file.
 *
 * @remarks
 *   The element is the actions package's `Button`, so every look, size and palette of the button
 *   applies. The machine hides it while no file is accepted, and a read-only upload hides it. A
 *   press removes every accepted and refused file and moves focus to the dropzone or the trigger.
 */

import { type MouseEvent, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { Button, type ButtonProps } from "@stealthscale/component-actions";

import { landings, refocus } from "#file-upload/focus.ts";
import { useFileUpload } from "#file-upload/machine.ts";
import { useShared } from "#file-upload/state.ts";

/**
 * Describes the props of the clear trigger: the props of the button.
 */
export type ClearTriggerProps = ButtonProps;

/**
 * Renders the clear trigger with the machine's props.
 *
 * @param props - The props of the button, merged over the machine's.
 * @returns The `button` element.
 */
export function ClearTrigger(props: ClearTriggerProps): ReactElement {
  const api = useFileUpload();
  const { readOnly } = useShared();

  /**
   * Moves focus to a control that adds files once the list is empty and this button is hidden.
   */
  function cleared(event: MouseEvent<HTMLButtonElement>): void {
    if (!event.defaultPrevented) refocus(landings(api));
  }

  return (
    <Button
      {...mergeProps(
        api.getClearTriggerProps(),
        { onClick: cleared },
        readOnly ? { hidden: true } : {},
        props,
      )}
    />
  );
}
