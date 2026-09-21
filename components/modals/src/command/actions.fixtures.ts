/**
 * Supplies the action list shared by every command palette specification.
 */

import { type CommandAction } from "#command/action.ts";

/**
 * Three actions: two sharing a group, and one ungrouped that carries keywords and a shortcut.
 */
export const ACTIONS: readonly CommandAction[] = [
  { group: "Go to", label: "Invoices", value: "invoices" },
  { group: "Go to", label: "Reports", value: "reports" },
  { keywords: "add create", label: "New document", shortcut: "N", value: "new" },
];
