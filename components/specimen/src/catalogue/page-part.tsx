/**
 * Draws what one part of a page accepts, as a section of the props band.
 */

import { type ReactElement } from "react";

import { Badge } from "@stealthscale/component-data";
import { Section } from "@stealthscale/component-screen";
import { Code } from "@stealthscale/component-typography";

import { type Part } from "#catalogue/parted.ts";
import { PropsTable } from "#catalogue/props-table.tsx";

/**
 * Describes what a part takes.
 */
export interface PartProps {
  /**
   * The anchor the section is reached by, which the rail beside the page points at.
   */
  readonly id: string;

  /**
   * The part, its props already split by kind.
   */
  readonly part: Part;
}

/**
 * Draws one part.
 *
 * @remarks
 *   The axes and the props go in one table, the axes first, because they are looked up by name and
 *   a name is in one list. The count sits beside the heading as a badge, which is what tells it
 *   from the name at a glance down a band of a dozen parts.
 *   The heading leads with the component and names the interface after it. A band of a dozen tables
 *   headed `RootProps` and `ItemProps` says what each table is a type of and never what it is a
 *   type for, and a reader who has just read an example writing `Menu.Item` has to work out which
 *   of the twelve that is. The interface is kept because it is the name an editor and an import
 *   know it by.
 *   The section carries the anchor rather than its heading, so the rail marks it while any part of
 *   it is on screen and a jump to it lands on its name.
 * @param props - The anchor and the part to draw.
 * @returns The part, as a section of the page.
 */
export function PartSection({ id, part }: PartProps): ReactElement {
  const { component, name, options, variants } = part;
  const rows = [...variants, ...options];

  return (
    <Section.Root id={id}>
      <Section.Header>
        <Section.Title>
          {component} <Code size="sm">{name}</Code>{" "}
          <Badge size="sm" variant="subtle">
            {rows.length}
          </Badge>
        </Section.Title>
      </Section.Header>
      <Section.Body>
        {rows.length === 0 ? null : <PropsTable label={name} rows={rows} />}
      </Section.Body>
    </Section.Root>
  );
}
