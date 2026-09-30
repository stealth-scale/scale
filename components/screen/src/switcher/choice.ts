/**
 * Describes one thing a switcher switches between, and derives its initials.
 */

import { type ReactNode } from "react";

/**
 * Describes one workspace, project or tenant a switcher lists.
 */
export interface Choice {
  /**
   * Plan, role or region, rendered under the name in a sidebar and in the menu's row.
   */
  readonly detail?: string | undefined;

  /**
   * Whether the reader cannot switch to the choice.
   */
  readonly disabled?: boolean | undefined;

  /**
   * Address of the choice's own page, which renders its row as a link.
   */
  readonly href?: string | undefined;

  /**
   * Name of the choice.
   */
  readonly label: string;

  /**
   * Logo or avatar. The mark shows the name's initials without one.
   */
  readonly mark?: ReactNode | undefined;

  /**
   * Value the application knows the choice by.
   */
  readonly value: string;
}

/**
 * Returns the initials of a name: the first letter of each of its first two words, in capitals.
 *
 * @param label - The name.
 * @returns One or two letters.
 */
export function initialsOf(label: string): string {
  return label
    .split(/\s+/u)
    .filter((word) => word !== "")
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}
