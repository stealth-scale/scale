/**
 * Draws one scene as a section of the page: its title, its opening, the component on a stage of
 * its own, and its source folded under the stage.
 */

import { type ReactElement, useRef } from "react";

import { Section } from "@stealthscale/component-screen";
import { Card } from "@stealthscale/component-surfaces";
import { useNarrow, useViewport } from "@stealthscale/provider-viewport";

import { marked } from "#catalogue/marked.tsx";
import { Source } from "#catalogue/page-source.tsx";
import { useWording } from "#catalogue/wording.ts";
import { type Frame, type Scene } from "#page.ts";
import { Stage } from "#stage/stage.ts";
import { stageWidthOf, widthsOf } from "#stage/width.ts";

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
 *   card's edges. The two are written out rather than chosen into one element, because the
 *   compiler reads the parts a page draws out of its source.
 *   The scene is drawn on a stage, which is held to the width the viewport states where one is
 *   stated, so a reader who picked a phone's width sees the scene fold as a phone folds it while
 *   the card, the page and the chrome around them keep their own. A scene that bleeds keeps its
 *   bleed only while the stage fills the card: held to a width the card is wider than, it is
 *   drawn in the card's content instead, because a stage bled to one edge and short of the other
 *   read as a panel cut off. The card is measured for that, the way every screen component
 *   measures itself, and until it has a box the stage is taken to fit inside it.
 */
export function SceneSection({ id, namespace, scene, source }: SceneSectionProps): ReactElement {
  const word = useWording(namespace);
  const { sizes, width } = useViewport();
  const card = useRef<HTMLDivElement>(null);
  const frame = scene.frame ?? "inset";
  const held = stageWidthOf(width, sizes);
  const pixels = widthsOf(sizes).find((size) => size.name === held)?.min ?? 0;
  const overflowing = useNarrow(card, pixels, "base");
  const bleeds = frame !== "inset" && (held === undefined || overflowing);
  const stage = (
    <Stage {...(held === undefined ? {} : { width: held })}>
      <scene.draw />
    </Stage>
  );

  return (
    <Section.Root id={id}>
      <Section.Header>
        <Section.Title>{word(scene.title)}</Section.Title>
        {scene.about === undefined ? null : (
          <Section.Description>{marked(word(scene.about))}</Section.Description>
        )}
      </Section.Header>
      <Section.Body>
        <Card.Root as="div" ref={card} variant={SURFACE[frame]}>
          {bleeds ? <Card.Media>{stage}</Card.Media> : <Card.Content>{stage}</Card.Content>}
          {source === undefined ? null : <Source code={source} title={word(scene.title)} />}
        </Card.Root>
      </Section.Body>
    </Section.Root>
  );
}
