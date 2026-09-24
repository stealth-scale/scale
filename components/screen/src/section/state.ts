/**
 * Provides the section's measured width and its title's id to the parts.
 *
 * @remarks
 *   The root derives the title's id with `useId` and the title reads it, so naming the section
 *   needs no effect and no second render.
 */

import { createRequiredContext } from "@stealthscale/hooks";

/**
 * Describes the state every part of a section reads.
 */
export interface SectionState {
  /**
   * Whether the section is narrower than the `sm` breakpoint.
   */
  narrow: boolean;

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
