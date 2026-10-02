/**
 * Renders the button that shows or hides a password input's value.
 *
 * @remarks
 *   The button renders inside a mark, and a mark at the box's end places it 4px from the edge. It
 *   is in the tab order, because no key in the field shows the value. A press toggles the value's
 *   visibility and keeps focus in the field. Enter and Space on the focused button toggle it and
 *   keep focus on the button. The button is named by `label` while the value is hidden and by
 *   `visibleLabel` while it is shown. It sets no `aria-expanded` or `aria-pressed`, because the
 *   name already states what a press does. Each change is announced as `visibleMessage` or
 *   `hiddenMessage`. The button is disabled with the input. In a read-only input it still shows and
 *   hides the value, because showing a value does not change it. The glyph is the caller's, usually
 *   through `PasswordInput.Indicator`.
 */

import { type ComponentProps, type MouseEvent, type ReactElement, useEffect, useRef } from "react";

import { mergeProps } from "@zag-js/react";

import { useAnnounce } from "@stealthscale/hooks";

import { Mark } from "#input-group/mark.ts";
import { withContext } from "#password-input/context.ts";
import { usePasswordInput } from "#password-input/machine.ts";

/**
 * Renders the `button` with the toggle recipe's class.
 */
const Toggle = withContext("button");

/**
 * Describes the props of the toggle: its two names, its two announcements and the props of a
 * `button`.
 */
export interface VisibilityTriggerProps extends Omit<ComponentProps<typeof Toggle>, "aria-label"> {
  /**
   * Announcement after the value is hidden. Defaults to `Your password is hidden`.
   */
  readonly hiddenMessage?: string | undefined;

  /**
   * Accessible name while the value is hidden. Defaults to `Show password`.
   */
  readonly label?: string | undefined;

  /**
   * Accessible name while the value is shown. Defaults to `Hide password`.
   */
  readonly visibleLabel?: string | undefined;

  /**
   * Announcement after the value is shown. Defaults to `Your password is visible`.
   */
  readonly visibleMessage?: string | undefined;
}

/**
 * Announces each change of the value's visibility after the first render.
 *
 * @param visible - Whether the value is shown.
 * @param message - The announcement for the current visibility.
 */
function useAnnounced(visible: boolean, message: string): void {
  const announce = useAnnounce();
  const shown = useRef(visible);

  useEffect(() => {
    if (shown.current === visible) return;

    shown.current = visible;
    announce(message);
  }, [announce, message, visible]);
}

/**
 * Renders the toggle in a mark, with the machine's props and a keyboard press.
 *
 * @param props - The names, the announcements and the props of the `button`, merged over the
 *   machine's.
 * @returns The mark that contains the `button`.
 */
export function VisibilityTrigger({
  hiddenMessage = "Your password is hidden",
  label = "Show password",
  visibleLabel = "Hide password",
  visibleMessage = "Your password is visible",
  ...rest
}: VisibilityTriggerProps): ReactElement {
  const api = usePasswordInput();

  /**
   * Toggles the visibility on a press from the keyboard, which fires a click with no pointer
   * detail, and on any press in a read-only input. The machine toggles a pointer press in an
   * editable input on `pointerdown` and ignores one in a read-only input.
   */
  const pressed = (event: MouseEvent<HTMLButtonElement>): void => {
    if (event.detail === 0 || event.currentTarget.dataset["readonly"] !== undefined) {
      api.toggleVisible();
    }
  };
  const { "aria-expanded": _expanded, ...merged } = mergeProps(
    api.getVisibilityTriggerProps(),
    { "aria-label": api.visible ? visibleLabel : label, onClick: pressed, tabIndex: 0 },
    rest,
  );

  useAnnounced(api.visible, api.visible ? visibleMessage : hiddenMessage);

  return (
    <Mark>
      <Toggle {...merged} />
    </Mark>
  );
}
