/**
 * Draws the body of one page: the line that imports its components, then each scene as a section
 * with its source folded under the stage.
 */

import { type ReactElement } from "react";

import { Import } from "#catalogue/page-import.tsx";
import { SceneSection } from "#catalogue/page-scene.tsx";
import { type Fragments, type Indexed } from "#catalogue/types.ts";
import { type Scene } from "#page.ts";

/**
 * Describes one scene as the page lists it: anchored, and worded.
 */
export interface Listed {
  /**
   * The anchor the scene's section is reached by.
   */
  readonly id: string;

  /**
   * The scene.
   */
  readonly scene: Scene;

  /**
   * The scene's title, worded.
   */
  readonly title: string;
}

/**
 * Describes what the body takes.
 */
export interface BodyProps {
  /**
   * The entry the index holds for the page.
   */
  readonly entry: Indexed;

  /**
   * Each scene's source and the components the page imports, or nothing until they are loaded.
   */
  readonly fragments: Fragments | undefined;

  /**
   * The path the application serves the framed page at, or nothing where it serves none.
   */
  readonly framed?: string | undefined;

  /**
   * The scenes, in the order they are on the page.
   */
  readonly scenes: readonly Listed[];
}

/**
 * Reads one scene's source out of the loaded fragments: the text, `null` where the index cut none
 * for the scene, or undefined until the fragments have loaded.
 *
 * @remarks
 *   A scene's source is keyed by the title the specimen declared, before wording, because the
 *   plugin cuts the source by the literal it finds in the file.
 *   A scene carrying its own is read first and waits for nothing. A built scene writes its own,
 *   because the plugin finds no declaration to cut for one.
 */
function sourceOf(fragments: Fragments | undefined, scene: Scene): null | string | undefined {
  if (scene.source !== undefined) return scene.source;
  if (fragments === undefined) return undefined;

  return fragments.fragments[scene.title] ?? null;
}

/**
 * Draws the import line and the scenes, for the page body its caller draws round them.
 */
export function Body({ entry, fragments, framed, scenes }: BodyProps): ReactElement {
  return (
    <>
      <Import names={fragments?.imported ?? []} package={entry.package} />
      {scenes.map(({ id, scene }, position) => (
        <SceneSection
          framed={framed}
          id={id}
          key={id}
          namespace={entry.namespace}
          page={entry.id}
          position={position}
          scene={scene}
          source={sourceOf(fragments, scene)}
        />
      ))}
    </>
  );
}
