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

import { useEffect, useRef } from "react";

import { isRecord } from "#guards.ts";

/**
 * The event the index dispatches on the window when a page's module was replaced.
 */
export const UPDATED = "specimen:updated";

/**
 * Describes what the event carries: the page, and the module that replaced the old one.
 */
export interface Update {
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
 * Reports whether a value is what the event carries.
 */
function isUpdate(detail: unknown): detail is Update {
  return isRecord(detail) && typeof detail["id"] === "string";
}

/**
 * Tells the listener each update the index reports for a page.
 *
 * @remarks
 *   The listener is kept in a ref and read when an update arrives, so a caller writes it inline
 *   and the window's listener is added once per page rather than once per render.
 * @param id - The page's identifier.
 * @param onUpdate - Told each update of that page.
 */
export function useUpdated(id: string, onUpdate: (update: Update) => void): void {
  const told = useRef(onUpdate);

  useEffect(() => {
    told.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    /**
     * Passes an update of this page on, and leaves any other event alone.
     */
    const listen = (event: Event): void => {
      const detail: unknown = event instanceof CustomEvent ? event.detail : undefined;

      if (isUpdate(detail) && detail.id === id) told.current(detail);
    };

    window.addEventListener(UPDATED, listen);

    return (): void => {
      window.removeEventListener(UPDATED, listen);
    };
  }, [id]);
}
