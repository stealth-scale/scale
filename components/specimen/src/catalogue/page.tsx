/**
 * Draws one page: its head, the line that imports its components, each scene as a section with
 * the component on a stage of its own and its source under it, and the rail beside them listing
 * the sections.
 */

import { type ReactElement } from "react";

import * as Screen from "@stealthscale/component-screen";

import { useLoadedPage } from "#catalogue/loaded.ts";
import { Body } from "#catalogue/page-body.tsx";
import { Contents } from "#catalogue/page-contents.tsx";
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
 * Loads the page's scenes and their sources, and draws them.
 *
 * @remarks
 *   The module and the sources are loaded through `useLoadedPage`, which also keeps what a hot
 *   update replaces, and the scenes are drawn once the module arrives; a page whose sources fail
 *   to load draws its scenes without them.
 *   Each scene is anchored by its worded title, so the rail beside the page points at it and the
 *   address of a section reads as its title does. A page with no scenes draws no rail.
 */
export function Page({ back, entry, framed }: PageProps): ReactElement {
  const { fragments, page } = useLoadedPage(entry);
  const word = useWording(entry.namespace);
  const scenes = (page?.scenes ?? []).map((scene) => ({
    id: slugOf(word(scene.title)),
    scene,
    title: word(scene.title),
  }));

  return (
    <Screen.Page.Root>
      <Header back={back} entry={entry} />
      <Body entry={entry} fragments={fragments} framed={framed} scenes={scenes} />
      {scenes.length === 0 ? null : <Contents of={scenes} />}
    </Screen.Page.Root>
  );
}
