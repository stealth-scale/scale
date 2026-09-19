/**
 * Draws one page: its head, each scene as a section with the component on a stage of its own,
 * and the rail beside them listing the sections.
 */

import { type ReactElement, useEffect, useState } from "react";

import * as Screen from "@stealthscale/component-screen";

import { declared } from "#catalogue/declared.ts";
import { Contents } from "#catalogue/page-contents.tsx";
import { Header } from "#catalogue/page-header.tsx";
import { SceneSection } from "#catalogue/page-scene.tsx";
import { slugOf } from "#catalogue/slug.ts";
import { type Indexed } from "#catalogue/types.ts";
import { useWording } from "#catalogue/wording.ts";
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
 *   Each scene is anchored by its worded title, so the rail beside the page points at it and the
 *   address of a section reads as its title does. A page with no scenes draws no rail.
 */
export function Page({ back, entry }: PageProps): ReactElement {
  const [page, setPage] = useState<Specimen | undefined>();
  const word = useWording(entry.namespace);
  const scenes = (page?.scenes ?? []).map((scene) => ({
    id: slugOf(word(scene.title)),
    scene,
    title: word(scene.title),
  }));

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
      <Header back={back} entry={entry} />
      <Screen.Page.Body>
        {scenes.map(({ id, scene }) => (
          <SceneSection id={id} key={id} namespace={entry.namespace} scene={scene} />
        ))}
      </Screen.Page.Body>
      {scenes.length === 0 ? null : <Contents of={scenes} />}
    </Screen.Page.Root>
  );
}
