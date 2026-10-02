/**
 * Renders the control a folded page shows in place of a strip of tabs.
 *
 * @remarks
 *   A strip of tabs on a narrow page wraps onto a second line or scrolls out of sight. The picker
 *   is the library's button in the outline look. Its words are the current tab's, it opens the
 *   others as a list, and it takes the room the navigation band leaves. Its words truncate before
 *   the mark at its end, so it keeps one line at every width. It sets neither `aria-expanded` nor
 *   `aria-controls`, because it is a trigger. Render it with `as` on a popover's or a menu's
 *   trigger, which sets both and handles the keys the pattern needs. `Page.TabList` renders one
 *   itself on a narrow page.
 */

import { type ComponentProps } from "react";

import { Button } from "@stealthscale/component-actions";

import { withContext } from "#page/context.ts";

/**
 * Renders the library's button with the recipe's picker class.
 */
export const Picker = withContext(Button, "picker", { defaultProps: { variant: "outline" } });

/**
 * Describes the props of the picker: the props of the library's button.
 */
export type PickerProps = ComponentProps<typeof Picker>;
