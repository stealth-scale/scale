/**
 * Draws the body of one page: the line that imports its components, then each scene as a section
 * with its source folded under the stage.
 */

import { type ReactElement } from "react";

import { Import } from "#catalogue/page-import.tsx";
import { SceneSection } from "#catalogue/page-scene.tsx";
import { type Indexed } from "#catalogue/types.ts";
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
   * The path the application serves the framed page at, or nothing where it serves none.
   */
  readonly framed?: string | undefined;

  /**
   * The statement the page opens with, or nothing where it declares none.
   */
  readonly imports?: string | undefined;

  /**
   * The scenes, in the order they are on the page.
   */
  readonly scenes: readonly Listed[];
}

/**
 * Draws the import line and the scenes, for the page body its caller draws round them.
 *
 * @remarks
 *   Each scene carries its own source, which the scene either writes out or is built with. A scene
 *   that carries none is drawn without a source control.
 */
export function Body({ entry, framed, imports, scenes }: BodyProps): ReactElement {
  return (
    <>
      <Import imports={imports} package={entry.package} />
      {scenes.map(({ id, scene }, position) => (
        <SceneSection
          framed={framed}
          id={id}
          key={id}
          namespace={entry.namespace}
          page={entry.id}
          position={position}
          scene={scene}
          source={scene.source ?? null}
        />
      ))}
    </>
  );
}
