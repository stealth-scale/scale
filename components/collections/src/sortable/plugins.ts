/**
 * Configures dnd-kit's plugins for a sortable kit: the announcements in the kit's words, and a
 * copy of the row at the place it will take.
 *
 * @remarks
 *   The accessibility plugin writes its live region once and asks for each sentence when an event
 *   arrives, so a root makes its plugins once and they read the root's latest state. The feedback
 *   plugin leaves a copy of the dragged row in the list, which the recipe renders as a dashed slot.
 *   dnd-kit hides the copy it leaves by default through a rule outside every cascade layer, which
 *   no recipe rule outranks, so the kit asks for the copy dnd-kit leaves visible.
 */

import { type Plugins } from "@dnd-kit/abstract";
import { Accessibility, Feedback } from "@dnd-kit/dom";

import { announcementsOf, type Announcing } from "#sortable/announcements.ts";

/**
 * Returns the function that replaces dnd-kit's default accessibility and feedback plugins with the
 * kit's.
 *
 * @param latest - Returns the kit's state as of its last render.
 */
export function pluginsOf(latest: () => Announcing): (defaults: Plugins) => Plugins {
  const announcements = announcementsOf(latest);

  return (defaults) =>
    defaults.map((plugin) => {
      if (plugin === Accessibility) return Accessibility.configure({ announcements });

      return plugin === Feedback ? Feedback.configure({ feedback: "clone" }) : plugin;
    });
}
