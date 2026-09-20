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
 *   The cards sit in a grid that fills each row with columns of the smallest measure, so a narrow
 *   page stacks them and a wide one draws them in rows without the index naming a breakpoint. The
 *   grid keeps the columns a short row leaves empty, so a group of one page draws one card at the
 *   measure every other card has rather than one card across the page.
 */
export function GroupSection({ group }: GroupSectionProps): ReactElement {
  const { t } = useTranslation("specimen");

  return (
    <Section.Root>
      <Section.Header>
        <Section.Title>
          {group.name === ""
            ? t("rail.ungrouped")
            : t(`groups.${group.name}`, { defaultValue: group.name })}
        </Section.Title>
      </Section.Header>
      <Section.Body>
        <Grid.Root columns="fill-xs" gap="md">
          {group.pages.map((page) => (
            <EntryCard key={page.id} page={page} />
          ))}
        </Grid.Root>
      </Section.Body>
    </Section.Root>
  );
}
