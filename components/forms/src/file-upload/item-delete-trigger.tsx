/**
 * Renders the button that removes one file from its list.
 *
 * @remarks
 *   The element is the input group's square `button`, in the tab order. It is named by `label`,
 *   which names the file, so a screen reader does not read a list of buttons with one name. A press
 *   removes the file from the accepted or the refused list and moves focus to the next row's delete
 *   trigger, the previous row's, or the dropzone or trigger when no row is left. A read-only upload
 *   hides it. The glyph is the caller's.
 */

import { type ComponentProps, type MouseEvent, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#file-upload/context.ts";
import { refocus, successors } from "#file-upload/focus.ts";
import { useFileUpload } from "#file-upload/machine.ts";
import { useItem, useShared } from "#file-upload/state.ts";

/**
 * Renders the `button` with the file upload's item delete trigger class.
 */
const Removing = withContext("button", "itemDeleteTrigger");

/**
 * Describes the props of the delete trigger: its accessible name and the props of a `button`.
 */
export interface ItemDeleteTriggerProps extends Omit<
  ComponentProps<typeof Removing>,
  "aria-label" | "aria-labelledby"
> {
  /**
   * Accessible name of the button. Defaults to `Remove` and the file's name, such as
   * `Remove statement.pdf`.
   */
  readonly label?: string | undefined;
}

/**
 * Renders the delete trigger with the machine's props.
 *
 * @param props - The accessible name and the props of the `button`, merged over the machine's.
 * @returns The `button` element.
 */
export function ItemDeleteTrigger({ label, ...rest }: ItemDeleteTriggerProps): ReactElement {
  const api = useFileUpload();
  const item = useItem();
  const { readOnly } = useShared();

  /**
   * Moves focus on from the row this press removes.
   */
  function removed(event: MouseEvent<HTMLButtonElement>): void {
    if (!event.defaultPrevented) refocus(successors(api, item));
  }

  return (
    <Removing
      {...mergeProps(
        api.getItemDeleteTriggerProps(item),
        { onClick: removed },
        readOnly ? { hidden: true } : {},
        rest,
      )}
      aria-label={label ?? `Remove ${item.file.name}`}
    />
  );
}
