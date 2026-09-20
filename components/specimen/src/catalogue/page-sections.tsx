/**
 * Draws the rail beside a page, listing the sections of whichever band is open.
 */

import { type ReactElement } from "react";

import { type Band, BANDS } from "#catalogue/bands.ts";
import { headings } from "#catalogue/headings.ts";
import { type Listed } from "#catalogue/page-body.tsx";
import { Contents } from "#catalogue/page-contents.tsx";
import { type Part } from "#catalogue/parted.ts";

/**
 * Describes what the rail takes.
 */
export interface SectionsProps {
  /**
   * The band the strip has open.
   */
  readonly band: Band;

  /**
   * The parts of the page, or nothing until they have been read.
   */
  readonly parts: readonly Part[] | undefined;

  /**
   * The scenes, in the order they are on the page.
   */
  readonly scenes: readonly Listed[];
}

/**
 * Lists the open band's sections, or nothing where it has none.
 *
 * @remarks
 *   One rail for both bands rather than one for the examples alone. Either band runs to a dozen
 *   sections, and a band without a rail is a band a reader scrolls.
 * @param props - The open band, the scenes and the parts.
 * @returns The rail, or nothing where the open band has no sections.
 */
export function Sections({ band, parts, scenes }: SectionsProps): null | ReactElement {
  const listed = band === BANDS.examples ? scenes : headings(parts ?? []);

  return listed.length === 0 ? null : <Contents of={listed} />;
}
