/**
 * Draws one page: the way back, its title and its opening, then each scene as a section with the
 * component on a stage of its own.
 */

import { type ReactElement, useEffect, useState } from "react";

import * as Screen from "@stealthscale/component-screen";
import { Card } from "@stealthscale/component-surfaces";

import { declared } from "#catalogue/declared.ts";
import { marked } from "#catalogue/marked.tsx";
import { Trail } from "#catalogue/page-trail.tsx";
import { type Indexed } from "#catalogue/types.ts";
import { type Specimen } from "#page.ts";

/**
 * Describes what a page takes.
 */
export interface PageProps {
  /**
   * The id of the route the trail at the head of the page leads to. No trail where it is absent.
   */
  readonly back?: string | undefined;

  /**
   * The entry the index holds for it.
   */
  readonly entry: Indexed;
}

/**
 * Loads the page's scenes and draws them.
 *
 * @remarks
 *   The module is loaded rather than imported, because the index reaches every page through a
 *   dynamic import and the bundler emits one chunk for each. Opening a page is the first time its
 *   components are fetched.
 *   Each scene draws its component on a card, so the component stands on a surface with an edge
 *   rather than loose on the page, and a sentence's backticks are drawn as code.
 */
export function Page({ back, entry }: PageProps): ReactElement {
  const [page, setPage] = useState<Specimen | undefined>();

  useEffect(() => {
    let watching = true;

    /**
     * Loads the module and keeps what it declares, unless the page has left the screen.
     */
    async function open(): Promise<void> {
      try {
        const module = await entry.load();

        if (watching) setPage(declared(module));
      } catch {
        if (watching) setPage(undefined);
      }
    }

    void open();

    return (): void => {
      watching = false;
    };
  }, [entry]);

  return (
    <Screen.Page.Root>
      <Screen.Page.Header>
        {back === undefined ? null : <Trail to={back} />}
        <Screen.Page.Title>{entry.title}</Screen.Page.Title>
        {entry.about === "" ? null : (
          <Screen.Page.Description>{marked(entry.about)}</Screen.Page.Description>
        )}
      </Screen.Page.Header>
      <Screen.Page.Body>
        {(page?.scenes ?? []).map((scene) => (
          <Screen.Section.Root key={scene.title}>
            <Screen.Section.Header>
              <Screen.Section.Title>{scene.title}</Screen.Section.Title>
              {scene.about === undefined ? null : (
                <Screen.Section.Description>{marked(scene.about)}</Screen.Section.Description>
              )}
            </Screen.Section.Header>
            <Screen.Section.Body>
              <Card.Root as="div" variant="outline">
                <Card.Content>
                  <scene.draw />
                </Card.Content>
              </Card.Root>
            </Screen.Section.Body>
          </Screen.Section.Root>
        ))}
      </Screen.Page.Body>
    </Screen.Page.Root>
  );
}
