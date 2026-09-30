/**
 * Fixtures for the overlay specs: a dialog rendered through `createOverlay`, with a button that
 * closes it with a result.
 */

import { type ReactElement } from "react";

import * as Dialog from "#dialog/index.ts";
import { type CreateOverlayProps } from "#overlay/overlay.tsx";

/**
 * Describes the props a case passes to `open`.
 */
export interface ProbeProps {
  /**
   * Title of the dialog, which names it.
   */
  readonly title: string;
}

/**
 * Renders an open dialog titled by `title`, with an Accept button that closes it with `accepted`
 * and a close trigger that dismisses it.
 *
 * @param props - The props the case passes to `open` and the props the store passes.
 * @returns The dialog's root around its panel.
 */
export function Probe({
  close,
  title,
  ...props
}: CreateOverlayProps<string> & ProbeProps): ReactElement {
  return (
    <Dialog.Root {...props}>
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Title>{title}</Dialog.Title>
          <button
            onClick={() => {
              close("accepted");
            }}
            type="button"
          >
            Accept
          </button>
          <Dialog.CloseTrigger aria-label="Dismiss">x</Dialog.CloseTrigger>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
