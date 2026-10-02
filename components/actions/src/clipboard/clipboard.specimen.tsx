/**
 * Catalogue page for the clipboard.
 *
 * @remarks
 *   Every scene is hand-written and renders a component from `examples/`. The size scene renders
 *   the three sizes itself, because the field and the button take the size through their own
 *   providers. The duration scene renders the `alone` example with each `timeout`. The trigger has
 *   no styles of its own, so every example renders it as `Button` or `IconButton` through `as`. The
 *   words are keys under `clipboard` in the `specimen` namespace, stored in
 *   `locales/en/specimen/clipboard.json`.
 */

import { Matrix, Room, type Scene, specimen } from "@stealthscale/specimen";

import * as alone from "#clipboard/examples/alone.example.tsx";
import * as beside from "#clipboard/examples/beside.example.tsx";
import * as own from "#clipboard/examples/own.example.tsx";
import * as sizes from "#clipboard/examples/sizes.example.tsx";
import * as valued from "#clipboard/examples/value.example.tsx";

/**
 * Copied-state durations the duration scene compares, in milliseconds.
 */
const TIMEOUTS = [250, 3000] as const;

/**
 * Hand-written scene for a copy button with visible text.
 */
export const lone: Scene = {
  about: "clipboard.alone.about",
  draw: () => <alone.Alone />,
  example: alone,
  title: "clipboard.alone.title",
};

/**
 * Hand-written scene for an icon button next to a read-only field.
 */
export const besides: Scene = {
  about: "clipboard.beside.about",
  draw: () => (
    <Room size="sm">
      <beside.Beside />
    </Room>
  ),
  example: beside,
  title: "clipboard.beside.title",
};

/**
 * Hand-written scene for the value as the trigger text.
 */
export const value: Scene = {
  about: "clipboard.value.about",
  draw: valued.Value,
  example: valued,
  title: "clipboard.value.title",
};

/**
 * Hand-written scene for a control built with `Clipboard.Consumer`.
 */
export const custom: Scene = {
  about: "clipboard.own.about",
  draw: own.Own,
  example: own,
  title: "clipboard.own.title",
};

/**
 * Hand-written scene for the `size` axis.
 */
export const size: Scene = {
  about: "clipboard.size.about",
  axes: ["size"],
  draw: () => (
    <Room size="sm">
      <sizes.Sizes />
    </Room>
  ),
  example: sizes,
  title: "clipboard.size.title",
};

/**
 * Hand-written scene for two copied-state durations.
 */
export const held: Scene = {
  about: "clipboard.held.about",
  draw: () => (
    <Matrix knob="timeout" of={TIMEOUTS}>
      {(timeout) => <alone.Alone timeout={timeout} />}
    </Matrix>
  ),
  example: alone,
  props: { timeout: 250 },
  title: "clipboard.held.title",
};

export default specimen({
  about: "clipboard.about",
  id: "components/actions/clipboard",
  imports:
    'import { Button, ButtonPropsProvider, Clipboard, IconButton } from "@stealthscale/component-actions";',
  scenes: [lone, besides, value, custom, size, held],
  title: "clipboard.title",
});
