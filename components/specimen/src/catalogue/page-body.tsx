/**
 * Renders the import statement and the scene sections of a catalogue page.
 */

import { type ReactElement } from "react";

import { Import } from "#catalogue/page-import.tsx";
import { SceneSection } from "#catalogue/page-scene.tsx";
import { type Indexed } from "#catalogue/types.ts";
import { type Scene, sourceOf } from "#page.ts";

/**
 * A scene as listed in the page body.
 */
export interface Listed {
  /**
   * Anchor ID of the scene section.
   */
  readonly id: string;

  /**
   * Scene declaration.
   */
  readonly scene: Scene;

  /**
   * Translated scene title.
   */
  readonly title: string;
}

/**
 * Props of {@link Body}.
 */
export interface BodyProps {
  /**
   * Index entry of the page.
   */
  readonly entry: Indexed;

  /**
   * Path of the framed page, or undefined when the application serves none.
   */
  readonly framed?: string | undefined;

  /**
   * Import statement of the page, or undefined when it declares none.
   */
  readonly imports?: string | undefined;

  /**
   * Scenes in display order.
   */
  readonly scenes: readonly Listed[];
}

/**
 * Renders the import statement and one section per scene.
 *
 * @remarks
 *   The source of each scene comes from {@link sourceOf}. A scene without a source renders a
 *   placeholder message instead of the source control.
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
          source={sourceOf(scene) ?? null}
        />
      ))}
    </>
  );
}
