/**
 * Follows the hot updates the index reports for one page, so a page or a frame redraws what a
 * specimen file now declares without the application running again.
 *
 * @remarks
 *   A specimen file exports scenes and constants beside its components, so the refresh runtime
 *   cannot accept it and an edit climbs to the index that imports it. The index accepts the edit
 *   there and dispatches this event on the window with the page's identifier and the module that
 *   replaced the old one, because the loaders it handed out import the module that was replaced.
 *   The event's name is the plugin's `UPDATED`, repeated here because the kit runs in the browser
 *   and the plugin in the bundler.
 */

import { useEffect } from "react";

import { type Fragments } from "#catalogue/types.ts";

/**
 * The event the index dispatches on the window when a page's module or its fragments were
 * replaced.
 */
export const UPDATED = "specimen:updated";

/**
 * Describes what the event carries: the page, and the module or the fragments that replaced the
 * old ones.
 */
export interface Update {
  /**
   * The page's fragments as loaded again, where the fragments were replaced.
   */
  readonly fragments?: unknown;

  /**
   * The page's identifier.
   */
  readonly id: string;

  /**
   * The page's module as loaded again, where the module was replaced.
   */
  readonly module?: unknown;
}

/**
 * Reports whether a value is an object whose fields can be read.
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * Reports whether a value is what the event carries.
 */
function isUpdate(detail: unknown): detail is Update {
  return isRecord(detail) && typeof detail["id"] === "string";
}

/**
 * Reports whether a value is a list of words.
 */
function isWorded(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every((word) => typeof word === "string");
}

/**
 * Reports whether a value is a record of snippets.
 */
function isSnippets(value: unknown): value is Readonly<Record<string, string>> {
  return isRecord(value) && Object.values(value).every((snippet) => typeof snippet === "string");
}

/**
 * Reads a page's fragments out of a module loaded again, or nothing where the module is not one.
 *
 * @param module - The module the index loaded again for the page's fragments.
 * @returns The fragments, or undefined.
 */
export function fragmentsOf(module: unknown): Fragments | undefined {
  if (!isRecord(module)) return undefined;

  const { fragments, imported } = module;

  return isSnippets(fragments) && isWorded(imported)
    ? { fragments, imported: [...imported] }
    : undefined;
}

/**
 * Tells the listener each update the index reports for a page.
 *
 * @param id - The page's identifier.
 * @param onUpdate - Told each update of that page.
 */
export function useUpdated(id: string, onUpdate: (update: Update) => void): void {
  useEffect(() => {
    /**
     * Passes an update of this page on, and leaves any other event alone.
     */
    const listen = (event: Event): void => {
      const detail: unknown = event instanceof CustomEvent ? event.detail : undefined;

      if (isUpdate(detail) && detail.id === id) onUpdate(detail);
    };

    window.addEventListener(UPDATED, listen);

    return (): void => {
      window.removeEventListener(UPDATED, listen);
    };
  }, [id, onUpdate]);
}
