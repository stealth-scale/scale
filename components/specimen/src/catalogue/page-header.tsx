/**
 * Draws the head of one page: the way back, the title, the group the page is filed under and the
 * opening.
 */

import { type ReactElement } from "react";

import { Badge } from "@stealthscale/component-data";
import { Page } from "@stealthscale/component-screen";
import { useTranslation } from "@stealthscale/provider-i18n";

import { marked } from "#catalogue/marked.tsx";
import { Trail } from "#catalogue/page-trail.tsx";
import { type Indexed } from "#catalogue/types.ts";
import { useWording } from "#catalogue/wording.ts";

/**
 * Describes what the head of a page takes.
 */
export interface HeaderProps {
  /**
   * The id of the route the trail leads to. No trail where it is absent.
   */
  readonly back?: string | undefined;

  /**
   * The entry the index holds for the page.
   */
  readonly entry: Indexed;
}

/**
 * Draws the head of a page inside the screen package's page.
 *
 * @remarks
 *   The title and the opening are keys in the namespace the page names, where it names one, and a
 *   sentence's backticks are drawn as code. The group the page is filed under stands beside the
 *   title as a badge on the neutral palette, worded the way the rail words it, and a page filed
 *   under no group has none. The group is a fact about where the page is, so it reads in the ink
 *   of the words around it rather than in the primary palette a badge draws a count in.
 */
export function Header({ back, entry }: HeaderProps): ReactElement {
  const { t } = useTranslation("specimen");
  const word = useWording(entry.namespace);

  return (
    <Page.Header>
      {back === undefined ? null : <Trail to={back} />}
      <Page.Title>{word(entry.title)}</Page.Title>
      {entry.group === "" ? null : (
        <Page.Meta>
          <Badge size="sm" status="neutral">
            {t(`groups.${entry.group}`, { defaultValue: entry.group })}
          </Badge>
        </Page.Meta>
      )}
      {entry.about === "" ? null : <Page.Description>{marked(word(entry.about))}</Page.Description>}
    </Page.Header>
  );
}
