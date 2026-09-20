/**
 * Draws the body of one page: the line that imports its components, then each scene as a section
 * with its source folded under the stage.
 */

import { type ReactElement } from "react";

import { Page } from "@stealthscale/component-screen";

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
 */
function sourceOf(fragments: Fragments | undefined, scene: Scene): null | string | undefined {
  if (fragments === undefined) return undefined;

  return fragments.fragments[scene.title] ?? null;
}

/**
 * Draws the import line and the scenes inside the screen package's page body.
 */
export function Body({ entry, fragments, scenes }: BodyProps): ReactElement {
  return (
    <Page.Body>
      <Import names={fragments?.imported ?? []} package={entry.package} />
      {scenes.map(({ id, scene }) => (
        <SceneSection
          id={id}
          key={id}
          namespace={entry.namespace}
          scene={scene}
          source={sourceOf(fragments, scene)}
        />
      ))}
    </Page.Body>
  );
}
