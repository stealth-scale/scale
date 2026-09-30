/**
 * Catalogue page for the swipe actions.
 *
 * @remarks
 *   Two hand-written scenes render the inbox example at a phone's width, left to right and right
 *   to left. The recipe has no axis, so no scene is generated. The words are keys under
 *   `swipe-actions` in `locales/en/specimen/swipe-actions.json`.
 */

import { Room, type Scene, specimen } from "@stealthscale/specimen";

import * as inbox from "#swipe-actions/examples/inbox.example.tsx";

/**
 * Hand-written scene for an inbox at a phone's width.
 */
export const phone: Scene = {
  about: "swipe-actions.inbox.about",
  draw: () => (
    <Room size="sm">
      <inbox.Inbox />
    </Room>
  ),
  example: inbox,
  title: "swipe-actions.inbox.title",
};

/**
 * Hand-written scene for the inbox laid out right to left.
 */
export const rightToLeft: Scene = {
  about: "swipe-actions.rtl.about",
  draw: () => (
    <Room size="sm">
      <div dir="rtl">
        <inbox.Inbox />
      </div>
    </Room>
  ),
  example: inbox,
  title: "swipe-actions.rtl.title",
};

export default specimen({
  about: "swipe-actions.about",
  id: "components/collections/swipe-actions",
  imports: 'import { SwipeActions } from "@stealthscale/component-collections";',
  scenes: [phone, rightToLeft],
  title: "swipe-actions.title",
});
