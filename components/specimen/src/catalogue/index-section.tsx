/**
 * Draws one group of the index as a section holding a card per page.
 */

import { type ReactElement } from "react";

import { Grid } from "@stealthscale/component-layout";
import { Section } from "@stealthscale/component-screen";

import { type Group } from "#catalogue/grouped.ts";
import { EntryCard } from "#catalogue/index-card.tsx";
import { useGroupName } from "#catalogue/wording.ts";

/**
 * Describes what one group's section takes.
 */
export interface GroupSectionProps {
  /**
   * The group and its pages.
   */
  readonly group: Group;

  /**
   * Whether the group is headed with its own name. Headed by default, and left unheaded on a page
   * the group itself is the title of.
   */
  readonly headed?: boolean | undefined;
}

/**
 * Draws one group of the index.
 *
 * @remarks
 *   The cards sit in a grid that fills each row with columns of the smallest measure, so a narrow
 *   page stacks them and a wide one draws them in rows without the index naming a breakpoint. The
 *   grid keeps the columns a short row leaves empty, so a group of one page draws one card at the
 *   measure every other card has rather than one card across the page.
 *   A group's own index heads the page with the group's name, so the section under it takes the
 *   name on the section itself rather than in a heading. Two headings reading the same word one
 *   above the other say the second is a different thing, which it is not.
 *   The grid is drawn as the section's body rather than inside one, so the section's body and the
 *   grid are one element and the document carries no div that means nothing to a reader. The grid
 *   is the part written in the source, because a part reads the variants written on it and a
 *   `columns` written on the body would be taken for the CSS property of that name instead.
 */
export function GroupSection({ group, headed = true }: GroupSectionProps): ReactElement {
  const named = useGroupName();

  return (
    <Section.Root {...(headed ? {} : { "aria-label": named(group.name) })}>
      {headed ? (
        <Section.Header>
          <Section.Title>{named(group.name)}</Section.Title>
        </Section.Header>
      ) : null}
      <Grid.Root as={Section.Body} columns="fill-xs" gap="md">
        {group.pages.map((page) => (
          <EntryCard key={page.id} page={page} />
        ))}
      </Grid.Root>
    </Section.Root>
  );
}
