/**
 * Renders one page: its header, and the bands that switch between its examples and what its parts
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
 * Props {@link Page} accepts.
 */
export interface PageProps {
  /**
   * Id of the route the back link leads to. No back link where it is absent.
   */
  readonly back?: string | undefined;

  /**
   * Index entry for the page.
   */
  readonly entry: Indexed;

  /**
   * Path the application serves the framed page at, which is what a device frames. No device where
   * it is absent.
   */
  readonly framed?: string | undefined;
}

/**
 * Loads the page's module and renders its scenes.
 *
 * @remarks
 *   `useDeclared` loads the module and applies its hot updates, and each scene supplies whatever
 *   source it shows, so nothing apart from the module is fetched for the page. Each scene is
 *   anchored by the slug of its translated title, so the rail links to it and the address of a
 *   section reads as its title. A module that rejects leaves the header in place and reports the
 *   failure under it.
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
