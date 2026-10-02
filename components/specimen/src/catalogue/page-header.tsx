/**
 * Draws the head of one page: the trail down to it, the title, and the opening.
 */

import { type ReactElement } from "react";

import { Page } from "@stealthscale/component-screen";

import { marked } from "#catalogue/marked.tsx";
import { Trail } from "#catalogue/page-trail.tsx";
import { type Indexed } from "#catalogue/types.ts";
import { useWording } from "#catalogue/wording.ts";

/**
 * Describes what the head of a page takes.
 */
export interface HeaderProps {
  /**
   * The id of the route the catalogue hangs under, which the trail is built from. No trail where
   * it is absent.
   */
  readonly catalogue?: string | undefined;

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
 *   sentence's backticks are drawn as code. The group the page is filed under is a crumb of the
 *   trail rather than a badge beside the title: the trail already names it, and naming it twice
 *   read as two facts where there is one.
 */
export function Header({ catalogue, entry }: HeaderProps): ReactElement {
  const word = useWording(entry.namespace);
  const parts = entry.id.split("/");
  const above = parts.length >= 3 ? { group: parts[1], section: parts[0] } : {};

  return (
    <Page.Header>
      {catalogue === undefined ? null : (
        <Trail catalogue={catalogue} {...above} title={word(entry.title)} />
      )}
      <Page.Title>{word(entry.title)}</Page.Title>
      {entry.about === "" ? null : <Page.Description>{marked(word(entry.about))}</Page.Description>}
    </Page.Header>
  );
}
