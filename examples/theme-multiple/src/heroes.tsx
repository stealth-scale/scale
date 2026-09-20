/**
 * Draws the buttons of a hero: a call to action at 2xl, 3xl and 4xl, a button holding an icon
 * beside its words, two raised off the page and one that glows.
 *
 * @remarks
 *   Every size is written as a literal, which is what the compiler extracts the rules for. The
 *   words of a hero button stay words while its box grows, because the label role grows slower
 *   than the control above xl. The icon beside the words is sized by the words, through the
 *   icon's inherited size, and the button's own gap keeps the two apart.
 */

import { type ReactElement } from "react";

import { Button } from "@stealthscale/component-actions";
import { Icon } from "@stealthscale/component-typography";
import { css } from "@stealthscale/theme";

/**
 * Lays a row of controls out, wrapping where the row is too narrow.
 */
const row = css({ alignItems: "center", display: "flex", flexWrap: "wrap", gap: "gap.sm" });

/**
 * Draws the hero buttons.
 */
export function Heroes(): ReactElement {
  return (
    <>
      <p className={row}>
        <Button size="2xl">Start free</Button>
        <Button size="3xl">Start free</Button>
        <Button size="4xl">Start free</Button>
      </p>
      <p className={row}>
        <Button variant="outline">
          <Icon viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2" />
          </Icon>
          Attach
        </Button>
        <Button elevation="raised" variant="surface">
          Raised
        </Button>
        <Button elevation="floating">Floating</Button>
        <Button effect="glow" variant="subtle">
          Glow
        </Button>
      </p>
    </>
  );
}
