/**
 * Defines the announcement levels of the alert and the ARIA attributes of each.
 */

/**
 * Announcement level of an alert.
 */
export type Live = "assertive" | "off" | "polite";

/**
 * Every announcement level, quietest first.
 */
export const LIVES: readonly Live[] = ["off", "polite", "assertive"];

/**
 * Maps each announcement level to the attributes the root sets.
 *
 * @remarks
 *   `role="alert"` implies `aria-live="assertive"` and `role="status"` implies
 *   `aria-live="polite"`, so the map sets the role only. `off` sets no attribute, because a live
 *   region announces its content on mount, and a page of static notices would read them all.
 */
export const ROLES: Readonly<Record<Live, Readonly<Record<string, string>>>> = {
  assertive: { role: "alert" },
  off: {},
  polite: { role: "status" },
};
