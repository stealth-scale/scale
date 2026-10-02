/**
 * Provides the section's measured width, its size and its title's id to the parts.
 *
 * @remarks
 *   The root derives the title's id with `useId` and the title reads it. The title records itself
 *   while it is mounted, so the section points `aria-labelledby` at a heading that exists.
 */

import { createRequiredContext } from "@stealthscale/hooks";

/**
 * Size of a section.
 */
export type SectionSize = "lg" | "md" | "sm";

/**
 * Describes the state every part of a section reads.
 */
export interface SectionState {
  /**
   * Whether the section is narrower than the width it folds at: 40rem, or 48rem when annotated.
   */
  narrow: boolean;

  /**
   * Records whether a title is mounted.
   */
  setTitled: (titled: boolean) => void;

  /**
   * Size of the section, which its actions render one size smaller than.
   */
  size: SectionSize;

  /**
   * The id the title sets and the section's `aria-labelledby` reads.
   */
  titleId: string;
}

/**
 * Creates the context through which the root provides the section state to its parts.
 */
export const [SectionProvider, useSection, useOptionalSection] =
  createRequiredContext<SectionState>("Section");

/**
 * Button size of a section's actions per section size, one size smaller than the section.
 *
 * @remarks
 *   A section's actions are one size smaller than the page's, because the section is one level
 *   under the page's header.
 */
const BUTTONS: Readonly<Record<SectionSize, "md" | "sm" | "xs">> = { lg: "md", md: "sm", sm: "xs" };

/**
 * Returns the button size of a section's actions.
 *
 * @param size - The section's size.
 * @returns The size the actions and the menu's trigger render at.
 */
export function buttonSizeOf(size: SectionSize): "md" | "sm" | "xs" {
  return BUTTONS[size];
}
