/**
 * Draws one scene as a section of the page: its title, its opening and the component on a stage
 * of its own.
 */

import { type ReactElement } from "react";

import { Section } from "@stealthscale/component-screen";
import { Card } from "@stealthscale/component-surfaces";

import { marked } from "#catalogue/marked.tsx";
import { useWording } from "#catalogue/wording.ts";
import { type Scene } from "#page.ts";

/**
 * Describes what a scene's section takes.
 */
export interface SceneSectionProps {
  /**
   * The anchor the section is reached by, which the page's contents point at.
   */
  readonly id: string;

  /**
   * The namespace the scene's words are keys in, or empty for the catalogue's own.
   */
  readonly namespace: string;

  /**
   * The scene.
   */
  readonly scene: Scene;
}

/**
 * Draws a scene as a section of the page.
 *
 * @remarks
 *   The scene's component stands on a card, so it stands on a surface with an edge rather than
 *   loose on the page, and a sentence's backticks are drawn as code. The section carries the
 *   anchor rather than its heading, so the contents mark it while any part of it is on screen and
 *   a jump to it lands on its title.
 */
export function SceneSection({ id, namespace, scene }: SceneSectionProps): ReactElement {
  const word = useWording(namespace);

  return (
    <Section.Root id={id}>
      <Section.Header>
        <Section.Title>{word(scene.title)}</Section.Title>
        {scene.about === undefined ? null : (
          <Section.Description>{marked(word(scene.about))}</Section.Description>
        )}
      </Section.Header>
      <Section.Body>
        <Card.Root as="div" variant="elevated">
          <Card.Content>
            <scene.draw />
          </Card.Content>
        </Card.Root>
      </Section.Body>
    </Section.Root>
  );
}
