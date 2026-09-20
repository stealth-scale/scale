/**
 * Draws the index of the catalogue: every page under its group, as a card that leads to it.
 */

import { type ReactElement } from "react";

import { Page } from "@stealthscale/component-screen";
import { useTranslation } from "@stealthscale/provider-i18n";
import { type RouteDeclaration } from "@stealthscale/provider-router";

import { grouped } from "#catalogue/grouped.ts";
import { GroupSection } from "#catalogue/index-section.tsx";

/**
 * Describes what the index takes.
 */
export interface IndexProps {
  /**
   * Every route compiled into the catalogue, whatever declared them. A declaration carrying no
   * entry is left out.
   */
  readonly declarations: readonly RouteDeclaration[];
}

/**
 * Draws the index: a page headed for the catalogue, with one section per group and a card per
 * page under it.
 */
export function Index({ declarations }: IndexProps): ReactElement {
  const { t } = useTranslation("specimen");

  return (
    <Page.Root>
      <Page.Header>
        <Page.Title>{t("index.title")}</Page.Title>
      </Page.Header>
      <Page.Body>
        {grouped(declarations).map((group) => (
          <GroupSection group={group} key={group.name} />
        ))}
      </Page.Body>
    </Page.Root>
  );
}
