/**
 * Renders a panel with the foundation's decorative styles: a moving border, a shining heading, a
 * glowing button, a pulsing button, a rippling button, and a marquee with faded edges.
 *
 * @remarks
 *   Every style and animation comes from the foundation through `layerStyle` and `animationStyle`,
 *   and each uses the `colorPalette` roles, so the panel follows the palette the theme sets. The
 *   marquee renders its words twice, so the loop has no visible seam when it restarts.
 */

import { type PointerEvent, type ReactElement } from "react";

import { Button } from "@stealthscale/example-lib-actions";
import { css } from "@stealthscale/theme";

/**
 * Styles the panel with a moving border around the panel surface, in the primary palette.
 */
const panel = css({
  animationStyle: "sweep",
  borderRadius: "l2",
  colorPalette: "primary",
  display: "flex",
  flexDirection: "column",
  gap: "gap.md",
  layerStyle: "border.moving",
  padding: "inset.md",
});

/**
 * Sets the heading in gradient text animated by the shimmer.
 */
const shine = css({ animationStyle: "shimmer", layerStyle: "text.shine", textStyle: "heading.md" });

/**
 * Lays out a row of controls that wraps when it is too narrow.
 */
const row = css({ alignItems: "center", display: "flex", flexWrap: "wrap", gap: "gap.sm" });

/**
 * Adds a static glow to the element.
 */
const glow = css({ layerStyle: "glow.md" });

/**
 * Adds a glow that pulses.
 */
const breathing = css({ animationStyle: "pulse-glow", boxShadowColor: "colorPalette.solid/50" });

/**
 * Adds a ripple that starts at the press position.
 */
const ripple = css({ layerStyle: "ripple" });

/**
 * Sets the pointer-down position as a percentage of the control's box, where the ripple starts.
 * Without it the ripple starts at the centre, as it does for a keyboard press.
 */
function pressed(event: PointerEvent<HTMLElement>): void {
  const box = event.currentTarget.getBoundingClientRect();
  const { style } = event.currentTarget;

  style.setProperty("--ripple-x", `${String(((event.clientX - box.left) / box.width) * 100)}%`);
  style.setProperty("--ripple-y", `${String(((event.clientY - box.top) / box.height) * 100)}%`);
}

/**
 * Clips the marquee's overflow, fades both edges and animates the marquee into view.
 */
const mask = css({ animationStyle: "reveal", layerStyle: "mask.edges", overflow: "hidden" });

/**
 * Scrolls a row of items across the marquee in a loop.
 */
const track = css({
  animationStyle: "marquee",
  display: "flex",
  gap: "gap.md",
  width: "max-content",
});

/**
 * The words the marquee scrolls.
 */
const WORDS = ["glow", "gradient", "moving border", "marquee", "shine", "glass", "aurora"];

/**
 * Renders the decorative panel.
 */
export function Candy(): ReactElement {
  return (
    <section className={panel}>
      <h2 className={shine}>Eye candy</h2>
      <p className={row}>
        <Button className={glow}>Glowing</Button>
        <Button className={breathing} palette="success">
          Breathing
        </Button>
        <Button className={ripple} onPointerDown={pressed} variant="subtle">
          Rippling
        </Button>
      </p>
      <div className={mask}>
        <div className={track}>
          {[...WORDS, ...WORDS].map((word, index) => (
            <span key={`${word}-${String(index)}`}>{word}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
