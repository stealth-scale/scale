/**
 * Renders a button that picks a color from the screen.
 *
 * @remarks
 *   The button renders only where the browser offers the EyeDropper API, the Chromium browsers on
 *   the desktop, and nothing on the server. A press opens the browser's eye dropper, and the color
 *   a person picks becomes the picker's. The button is named by `label`, "Pick a color from the
 *   screen" by default, and contains the caller's glyph.
 */

import { type ComponentProps, type ReactElement, useSyncExternalStore } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#color-picker/context.ts";
import { useColorPicker } from "#color-picker/machine.ts";

/**
 * Renders the `button` with the color picker's eye dropper trigger class.
 */
const Pressed = withContext("button", "eyeDropperTrigger");

/**
 * Describes the props of the eye dropper trigger: its name, its glyph and the props of a
 * `button`.
 */
export interface EyeDropperTriggerProps extends ComponentProps<typeof Pressed> {
  /**
   * Name of the button. Defaults to "Pick a color from the screen".
   */
  readonly label?: string | undefined;
}

/**
 * Subscribes to nothing, because a browser's support for the API does not change.
 *
 * @returns A function that unsubscribes nothing.
 */
function subscribe(): () => void {
  return (): void => undefined;
}

/**
 * Returns whether the browser offers the EyeDropper API.
 */
function supported(): boolean {
  return "EyeDropper" in window;
}

/**
 * Returns false on the server, where no browser offers the API.
 */
function unsupported(): boolean {
  return false;
}

/**
 * Renders the trigger with the machine's trigger props and its name, where the browser offers the
 * API.
 *
 * @param props - The name, the glyph and the props of a `button`.
 * @returns The `button` element, or nothing where the browser does not offer the API.
 */
export function EyeDropperTrigger({
  label = "Pick a color from the screen",
  ...props
}: EyeDropperTriggerProps): null | ReactElement {
  const api = useColorPicker();
  const available = useSyncExternalStore(subscribe, supported, unsupported);

  if (!available) return null;

  return (
    <Pressed {...mergeProps(api.getEyeDropperTriggerProps(), { "aria-label": label }, props)} />
  );
}
