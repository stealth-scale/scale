/**
 * Defines the actions every command specification lists.
 */

import { type CommandAction } from "#command/action.ts";

/**
 * Three actions: two in one group, and one without a group that has keywords and a shortcut.
 */
export const ACTIONS: readonly CommandAction[] = [
  { group: "Go to", label: "Invoices", value: "invoices" },
  { group: "Go to", label: "Reports", value: "reports" },
  { keywords: "add create", label: "New document", shortcut: "N", value: "new" },
];
