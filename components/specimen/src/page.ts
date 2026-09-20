/**
 * Declares what a page of a catalogue is and what is drawn on it.
 *
 * @remarks
 *   Every field is declared rather than derived from the file's path. A path only hints at where a
 *   page belongs, and a rule written for one repository layout is silently wrong for another.
 */

import { type FC } from "react";

/**
 * Selects how a scene meets the card it is drawn on.
 */
export type Frame = "bare" | "bleed" | "inset";

/**
 * Lists the frames, quietest first.
 */
export const FRAMES: readonly Frame[] = ["inset", "bleed", "bare"];

/**
 * Describes one thing on a page: what it is called, what it shows, and what draws it.
 */
export interface Scene {
  /**
   * The sentence the scene opens with, where the title alone does not say what it shows.
   */
  about?: string;

  /**
   * Draws the scene.
   *
   * @remarks
   *   A component rather than a node, so a scene that holds state declares its hooks in its own
   *   render. Called as a function, those hooks would belong to whatever drew it.
   */
  draw: FC;

  /**
   * How the scene meets the card it is drawn on. Inset when absent.
   *
   * @remarks
   *   `inset` leaves the card's own room round the scene, which is right for a component that
   *   carries no surface of its own. `bleed` takes that room back, so a component that is already
   *   a panel reaches the card's edges rather than sitting as a box inside a box. `bare` drops the
   *   card's surface, for a scene that should stand on the page as it would in an application.
   *   The source control keeps the card's room in every frame, because a control flush to the
   *   page's edge reads as part of the scene rather than as part of the catalogue.
   */
  frame?: Frame;

  /**
   * The name the scene is headed with, which also keys its source in the catalogue.
   */
  title: string;

  /**
   * Whether the scene fills the window it is drawn in. False when absent.
   *
   * @remarks
   *   A shell is the height of its window, so a device shows one at the window's edges, whatever
   *   frame the scene meets its card with, because room round it would push it past the window's
   *   foot. Everything else is drawn in the device the way it meets its card.
   */
  viewport?: boolean;
}

/**
 * Describes one page: where it belongs, what it is called, and what is on it.
 */
export interface Specimen {
  /**
   * The sentence or two the page opens with.
   */
  about?: string;

  /**
   * The group a navigation rail lists the page under. Listed on its own when absent.
   */
  group?: string;

  /**
   * The address of the page, unique across the catalogue.
   *
   * @remarks
   *   Stable and never displayed, so a title can be rewritten or translated without a link moving.
   *   Two pages declaring one identifier leave the second unreachable, which the index refuses.
   */
  id: string;

  /**
   * The catalogue namespace the page's words are keys in: the title, the opening, and each
   * scene's title and opening. The catalogue's own, `specimen`, when absent.
   *
   * @remarks
   *   Stated as a literal, because the index plugin reads it out of the source. The words follow
   *   the language a reader chose, and a key with no entry is shown as the key, so a page written
   *   in plain words reads as written.
   */
  namespace?: string;

  /**
   * The scenes, in the order they are drawn.
   *
   * @remarks
   *   Listed rather than gathered from the file's exports. A module returns its names in
   *   alphabetical order, so a page written Variants, States, Anatomy would be read back Anatomy,
   *   States, Variants in every catalogue built on it.
   */
  scenes: readonly Scene[];

  /**
   * The name the page is headed with. Derived from the last segment of the identifier when absent.
   */
  title?: string;
}

/**
 * Declares a page of the catalogue.
 *
 * @remarks
 *   A function rather than a bare object, so what a page may declare is checked where it is
 *   written rather than wherever a catalogue reads it. The index parses the call out of the source
 *   and never evaluates it, so the return value is the argument unchanged.
 */
export function specimen(page: Specimen): Specimen {
  return page;
}

/**
 * Declares one scene.
 */
export function scene(shown: Scene): Scene {
  return shown;
}
