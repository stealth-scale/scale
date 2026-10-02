/**
 * Renders the development panel: a floating window over the standalone page, open from the start,
 * with every control of the page.
 */

import { type ReactElement, useState } from "react";

import { FloatingPanel } from "@stealthscale/component-screen";
import { useTranslation } from "@stealthscale/provider-i18n";

import { useStandalone } from "#standalone/context.ts";
import { PanelControls } from "#standalone/controls.tsx";

/**
 * The panel's width, in CSS pixels.
 */
const WIDTH = 352;

/**
 * The panel's height where the window has room for it, in CSS pixels.
 */
const HEIGHT = 560;

/**
 * The room between the panel and the window's edges, in CSS pixels.
 */
const GAP = 16;

/**
 * Describes where the panel opens and how large it is.
 */
interface Placement {
  /**
   * The panel's top-left corner, in window coordinates.
   */
  readonly position: FloatingPanel.Point;

  /**
   * The panel's size.
   */
  readonly size: FloatingPanel.Size;
}

/**
 * Returns the panel's place at the window's bottom-end corner, no taller than the window allows.
 */
function placementOf(width: number, height: number): Placement {
  const tall = Math.min(HEIGHT, height - 2 * GAP);

  return {
    position: { x: Math.max(GAP, width - WIDTH - GAP), y: Math.max(GAP, height - tall - GAP) },
    size: { height: tall, width: WIDTH },
  };
}

/**
 * Renders the panel, which a person drags, resizes and minimizes, and never closes.
 *
 * @remarks
 *   The panel opens at the window's bottom-end corner and is open for the page's life, so it needs
 *   no trigger on the page. It is not modal: the page under it takes the pointer and the keys. Its
 *   stage triggers render where the page's glyphs give theirs.
 * @returns The panel's root.
 */
export function StandalonePanel(): ReactElement {
  const { glyphs } = useStandalone();
  const { t } = useTranslation("host");
  const [{ position, size }] = useState(() => placementOf(window.innerWidth, window.innerHeight));

  return (
    <FloatingPanel.Root defaultPosition={position} defaultSize={size} open>
      <FloatingPanel.Positioner>
        <FloatingPanel.Content>
          <FloatingPanel.Header>
            <FloatingPanel.DragTrigger>
              <FloatingPanel.Title>{t("standalone.panel.title")}</FloatingPanel.Title>
            </FloatingPanel.DragTrigger>
            <FloatingPanel.Control>
              {glyphs.minimize === undefined ? null : (
                <FloatingPanel.StageTrigger stage="minimized">
                  {glyphs.minimize}
                </FloatingPanel.StageTrigger>
              )}
              {glyphs.restore === undefined ? null : (
                <FloatingPanel.StageTrigger stage="default">
                  {glyphs.restore}
                </FloatingPanel.StageTrigger>
              )}
            </FloatingPanel.Control>
          </FloatingPanel.Header>
          <FloatingPanel.Body>
            <PanelControls />
          </FloatingPanel.Body>
          <FloatingPanel.ResizeTriggers />
        </FloatingPanel.Content>
      </FloatingPanel.Positioner>
    </FloatingPanel.Root>
  );
}
