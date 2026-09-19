/**
 * Draws one group of the rail as a branch of the list, open where it holds the page being read.
 */

import { type ReactElement } from "react";

import { NavList } from "@stealthscale/component-navigation";
import { useTranslation } from "@stealthscale/provider-i18n";

import { Chevron } from "#catalogue/chevron.tsx";
import { type Group } from "#catalogue/grouped.ts";
import { Row } from "#catalogue/rail-row.tsx";

/**
 * Describes what one group takes.
 */
export interface BranchProps {
  /**
   * The group and its pages.
   */
  readonly group: Group;

  /**
   * Whether the group holds the page being read, which opens it.
   */
  readonly holdsCurrent: boolean;
}

/**
 * Draws one group of the rail.
 *
 * @remarks
 *   The branch opens on its own state once drawn, so a reader opens and closes it by hand. The
 *   rail redraws it when the page being read moves to another group, which is what closes it
 *   again. Draw it inside `NavList.Root`, which the rail does.
 */
export function Branch({ group, holdsCurrent }: BranchProps): ReactElement {
  const { t } = useTranslation("specimen");

  return (
    <NavList.Branch defaultOpen={holdsCurrent}>
      <NavList.Trigger>
        {group.name === ""
          ? t("rail.ungrouped")
          : t(`groups.${group.name}`, { defaultValue: group.name })}
        <NavList.Indicator>
          <Chevron />
        </NavList.Indicator>
      </NavList.Trigger>
      <NavList.Content>
        {group.pages.map((page) => (
          <Row key={page.id} page={page} />
        ))}
      </NavList.Content>
    </NavList.Branch>
  );
}
