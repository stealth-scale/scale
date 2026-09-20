/**
 * Draws one group of the rail as a branch of the list, open where it holds the page being read.
 */

import { type ReactElement } from "react";

import { ChevronRightIcon } from "lucide-react";

import { NavList } from "@stealthscale/component-navigation";

import { type Group } from "#catalogue/grouped.ts";
import { Row } from "#catalogue/rail-row.tsx";
import { useGroupName } from "#catalogue/wording.ts";

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
  const named = useGroupName();

  return (
    <NavList.Branch defaultOpen={holdsCurrent}>
      <NavList.Trigger>
        {named(group.name)}
        <NavList.Indicator>
          <ChevronRightIcon aria-hidden size="1em" />
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
