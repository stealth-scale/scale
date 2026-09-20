/**
 * Draws a scene in the card's content or its media, by how the scene meets the card, or a device
 * showing the scene where a reader picked one.
 */

import { type ReactElement } from "react";

import { Card } from "@stealthscale/component-surfaces";

import { Device } from "#device/device.tsx";
import { useDevice } from "#device/scene.ts";
import { type Frame } from "#page.ts";

/**
 * Describes what the staging takes: the scene, drawn, and how it meets the card.
 */
export interface StagedProps {
  /**
   * The scene, drawn.
   */
  readonly children: ReactElement;

  /**
   * How the scene meets the card.
   */
  readonly frame: Frame;
}

/**
 * Draws the scene in the card's content for an inset frame and in its media for a bled or bared
 * one, or a device in the content whatever the frame while a reader shows the scene in one.
 *
 * @remarks
 *   The two parts are written out rather than chosen into one element, because the compiler reads
 *   the parts a page draws out of its source. A device is a row of pickers over a window that
 *   loads the scene inside, so the scene is not drawn on the page beside it, and the device takes
 *   the card's room however the scene itself would have met the card.
 * @param props - The scene and its frame.
 * @returns The card's content or its media, holding the scene or the device.
 */
export function Staged({ children, frame }: StagedProps): ReactElement {
  const held = useDevice();

  if (held !== undefined) {
    return (
      <Card.Content>
        <Device device={held.device} scene={held.scene} />
      </Card.Content>
    );
  }
  if (frame === "inset") return <Card.Content>{children}</Card.Content>;

  return <Card.Media>{children}</Card.Media>;
}
