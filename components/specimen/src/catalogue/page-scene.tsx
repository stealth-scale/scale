/**
 * Draws one scene as a section of the page: its title, its opening, the component on a card of
 * its own, and its source folded under the card.
 */

import { type ReactElement, useRef } from "react";

import { Section } from "@stealthscale/component-screen";
import { Card } from "@stealthscale/component-surfaces";

import { marked } from "#catalogue/marked.tsx";
import { Staged } from "#catalogue/page-staged.tsx";
import { Tools } from "#catalogue/page-tools.tsx";
import { useWording } from "#catalogue/wording.ts";
import { type SceneAddress, SceneProvider } from "#device/scene.ts";
import { type Frame, type Scene } from "#page.ts";

/**
 * Lists the look the card is drawn in for each frame a scene can take.
 *
 * @remarks
 *   A bared scene keeps the card and drops its surface, rather than dropping the card. The card is
 *   what holds the source control and the room round it, so a scene that dropped it would take the
 *   control with it or leave it flush against the page.
 */
const SURFACE: Readonly<Record<Frame, "elevated" | "plain">> = {
  bare: "plain",
  bleed: "elevated",
  inset: "elevated",
};

/**
 * Describes what a scene's section takes.
 */
export interface SceneSectionProps {
  /**
   * The path the application serves the framed page at, or nothing where it serves none.
   */
  readonly framed?: string | undefined;

  /**
   * The anchor the section is reached by, which the page's contents point at.
   */
  readonly id: string;

  /**
   * The namespace the scene's words are keys in, or empty for the catalogue's own.
   */
  readonly namespace: string;

  /**
   * The identifier of the page the scene is on.
   */
  readonly page: string;

  /**
   * The position of the scene on the page.
   */
  readonly position: number;

  /**
   * The scene.
   */
  readonly scene: Scene;

  /**
   * The scene's source: the text, `null` where the index cut none for the scene, or undefined
   * until the sources have loaded.
   */
  readonly source?: null | string | undefined;
}

/**
 * Draws a scene as a section of the page.
 *
 * @remarks
 *   The scene's component stands on a card, so it stands on a surface with an edge rather than
 *   loose on the page, and a sentence's backticks are drawn as code. The section carries the
 *   anchor rather than its heading, so the contents mark it while any part of it is on screen and
 *   a jump to it lands on its title. The source sits at the foot of the card, behind a control at
 *   its right end, headed by the scene's worded title once shown.
 *   An inset scene is drawn in the card's content, which leaves the card's own room round it. A
 *   bled or bared scene is drawn in the card's media, which takes that room back through the
 *   property the card states its inset in, so a component that is already a panel reaches the
 *   card's edges.
 *   The scene's address is put in scope, so the staging can show the scene in a device when a
 *   reader picks one, at the address a frame loads it at.
 */
export function SceneSection({
  framed,
  id,
  namespace,
  page,
  position,
  scene,
  source,
}: SceneSectionProps): ReactElement {
  const word = useWording(namespace);
  const frame = scene.frame ?? "inset";
  const title = word(scene.title);
  const address: SceneAddress = { page, path: framed, scene: position, title };
  const stage = useRef<HTMLDivElement>(null);

  return (
    <SceneProvider value={address}>
      <Section.Root id={id}>
        <Section.Header>
          <Section.Title>{title}</Section.Title>
          {scene.about === undefined ? null : (
            <Section.Description>{marked(word(scene.about))}</Section.Description>
          )}
        </Section.Header>
        <Section.Body>
          <Card.Root as="div" variant={SURFACE[frame]}>
            <Staged frame={frame} ref={stage}>
              <scene.draw />
            </Staged>
            {source === undefined ? null : <Tools code={source} stage={stage} title={title} />}
          </Card.Root>
        </Section.Body>
      </Section.Root>
    </SceneProvider>
  );
}
