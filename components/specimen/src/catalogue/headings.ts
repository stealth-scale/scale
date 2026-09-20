/**
 * Lists the parts of a page the way a rail lists a section, so the props band has a rail of its own
 * rather than none.
 */

import { type Heading } from "#catalogue/page-contents.tsx";
import { type Part } from "#catalogue/parted.ts";
import { slugOf } from "#catalogue/slug.ts";

/**
 * Returns one heading per part, anchored by the part's own name.
 *
 * @remarks
 *   The rail lists the component rather than the interface, which is what the section it points at
 *   is headed by. A rail that named the interfaces would read as a second list of a different set
 *   of things.
 * @param parts - The parts, in the order they are drawn.
 * @returns One heading per part.
 */
export function headings(parts: readonly Part[]): readonly Heading[] {
  return parts.map((part) => ({ id: slugOf(part.name), title: part.component }));
}
