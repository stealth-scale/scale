/**
 * Defines the announcement levels an alert supports and resolves each one to ARIA attributes.
 */

/**
 * Identifies the announcement level an alert is mounted at.
 */
export type Live = "assertive" | "off" | "polite";

/**
 * Lists every announcement level, ordered quietest first.
 */
export const LIVES: readonly Live[] = ["off", "polite", "assertive"];

/**
 * Maps an announcement level to the attributes the root spreads onto its element.
 *
 * @remarks
 *   `role="alert"` implies `aria-live="assertive"` and `role="status"` implies
 *   `aria-live="polite"`, so the role alone is sufficient and an explicit `aria-live` would
 *   duplicate it. `off` resolves to no attributes rather than `aria-live="off"`, because a live
 *   region announces its contents on mount: a surface rendering a column of static notices would
 *   otherwise read all of them out before the user asked for anything.
 */
export const ROLES: Readonly<Record<Live, Readonly<Record<string, string>>>> = {
  assertive: { role: "alert" },
  off: {},
  polite: { role: "status" },
};
