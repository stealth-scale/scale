/**
 * Draws one group of the index as a section holding a card per page.
 */

import { type ReactElement } from "react";

import { Grid } from "@stealthscale/component-layout";
import { Section } from "@stealthscale/component-screen";
import { useTranslation } from "@stealthscale/provider-i18n";

import { type Group } from "#catalogue/grouped.ts";
import { EntryCard } from "#catalogue/index-card.tsx";

/**
 * Describes what one group's section takes.
 */
export interface GroupSectionProps {
  /**
   * The group and its pages.
   */
  readonly group: Group;
}

/**
 * Draws one group of the index.
 *
 * @remarks
 *   The cards sit in a grid that fits as many of the smallest measure as there is room for, so a
 *   narrow page stacks them and a wide one draws them in rows without the index naming a
 *   breakpoint.
 */
export function GroupSection({ group }: GroupSectionProps): ReactElement {
  const { t } = useTranslation("specimen");

  return (
    <Section.Root>
      <Section.Header>
        <Section.Title>{group.name === "" ? t("rail.ungrouped") : group.name}</Section.Title>
      </Section.Header>
      <Section.Body>
        <Grid.Root columns="fit-xs" gap="md">
          {group.pages.map((page) => (
            <EntryCard key={page.id} page={page} />
          ))}
        </Grid.Root>
      </Section.Body>
    </Section.Root>
  );
}
