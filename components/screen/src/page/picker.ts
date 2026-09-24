/**
 * Renders the control a folded page shows in place of a strip of tabs.
 *
 * @remarks
 *   A strip of tabs on a narrow page wraps onto several lines or scrolls out of sight. The picker
 *   names the current tab and opens the others as a list. Its text truncates before the mark at
 *   its end, so it keeps one line at every width. It sets neither `aria-expanded` nor
 *   `aria-controls`, because it is a trigger. Render it as a menu's trigger,
 *   `<Menu.Trigger as={Page.Picker} />`, which sets both and handles the keys the pattern needs.
 */

import { type ComponentProps } from "react";

import { withContext } from "#page/context.ts";

/**
 * Renders the `button` with the recipe's picker class.
 */
export const Picker = withContext("button", "picker", { defaultProps: { type: "button" } });

/**
 * Describes the props of the picker: the props of a `button`.
 */
export type PickerProps = ComponentProps<typeof Picker>;
