/**
 * Draws one page: its head, and the strip that switches between its examples and what its parts
 * accept.
 */

import { type ReactElement } from "react";

import { Failed } from "#catalogue/failed.tsx";
import { useDeclared } from "#catalogue/loaded.ts";
import { Bands } from "#catalogue/page-bands.tsx";
import { Header } from "#catalogue/page-header.tsx";
import { slugOf } from "#catalogue/slug.ts";
import { type Indexed } from "#catalogue/types.ts";
import { useWording } from "#catalogue/wording.ts";

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

  /**
   * The path the application serves the framed page at, which is where a scene is shown in a
   * device. No device where it is absent.
   */
  readonly framed?: string | undefined;
}

/**
 * Loads the page's scenes and draws them.
 *
 * @remarks
 *   The module is loaded through `useDeclared`, which also keeps what a hot update replaces, and
 *   the scenes are drawn once the module arrives. Each scene carries whatever source it shows, so
 *   nothing beside the module is loaded for the page.
 *   Each scene is anchored by its worded title, so the rail beside the page points at it and the
 *   address of a section reads as its title does. A module that fails to load leaves the head of
 *   the page in place and says under it why there is nothing else, with the one thing a reader can
 *   do about a chunk a deployment no longer serves.
 */
export function Page({ back, entry, framed }: PageProps): ReactElement {
  const { failure, page } = useDeclared(entry);
  const word = useWording(entry.namespace);
  const scenes = (page?.scenes ?? []).map((scene) => ({
    id: slugOf(word(scene.title)),
    scene,
    title: word(scene.title),
  }));

  return (
    <Bands entry={entry} framed={framed} imports={page?.imports} scenes={scenes}>
      <>
        <Header back={back} entry={entry} />
        {failure === undefined ? null : <Failed failure={failure} said="page.failed" />}
      </>
    </Bands>
  );
}
