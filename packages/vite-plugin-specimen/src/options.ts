/**
 * Names the modules the plugin answers, and describes what a repository configures it with.
 */

import { type Reading } from "#anatomy/reading.ts";

/**
 * The specifier a catalogue imports the index from.
 */
export const ID = "virtual:specimen-index";

/**
 * The specifier prefix a catalogue imports one page's scenes as source from. The page's identifier
 * follows it.
 */
export const FRAGMENTS = "virtual:specimen-fragments/";

/**
 * The specifier prefix a catalogue imports one page's props from. The page's identifier follows it.
 */
export const PROPS = "virtual:specimen-props/";

/**
 * The event the index dispatches on the window when a page's module or its fragments were replaced
 * by a hot update, carrying the page's identifier and the new module as its detail.
 *
 * @remarks
 *   A specimen file exports scenes and constants beside its components, so the refresh runtime
 *   cannot accept it and the update climbs to the index. The index accepts it there, so nothing
 *   above the index is run again, and tells the catalogue through this event, because the loaders
 *   the index handed out import the module that was replaced. The catalogue kit listens for the
 *   same name.
 */
export const UPDATED = "specimen:updated";

/**
 * Describes what a repository configures the index with.
 */
export interface Options {
  /**
   * The globs to search, resolved against the project root.
   *
   * @remarks
   *   Required rather than defaulted. A pattern is relative to the application root, and an
   *   application that shows a catalogue of a workspace's components sits beside those components
   *   rather than above them, so no default is right for both arrangements. Several patterns are
   *   accepted, because a catalogue gathers directories that share no parent and because a pattern
   *   pointing into `node_modules` is how an installed package's specimens are found.
   */
  readonly patterns: readonly string[];

  /**
   * Reads what each page's components accept, out of their types.
   *
   * @remarks
   *   Left out, no page carries props and no compiler is started. Stated, each page gets a loader
   *   for its own and the compiler starts when the first page is opened. `Reading` documents every
   *   member and every member has a default, so `props: {}` turns the reading on.
   */
  readonly props?: Reading | undefined;
}
