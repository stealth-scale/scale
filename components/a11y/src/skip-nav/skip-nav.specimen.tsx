/**
 * Shows the skip link: the link that comes into view under focus, and the target it lands on.
 *
 * @remarks
 *   The skip link has no axis, so the scene draws the pair once rather than a matrix. The pair
 *   names its own target, because the catalogue's shell already holds a skip link pointing at the
 *   default one, and two links to one target would be two controls that do the same thing. The
 *   words are keys under `skip-nav` in the catalogue's namespace, kept beside this file in
 *   `locales/en/specimen/skip-nav.json`.
 */

import { type ReactElement, useId } from "react";

import { Stack } from "@stealthscale/component-layout";
import { type Scene, specimen, Tile, useWords } from "@stealthscale/specimen";

import { Link, Target } from "#skip-nav/index.ts";

/**
 * Draws the link and the target it points at.
 */
function Pair(): ReactElement {
  const { t } = useWords("skip-nav");
  const id = useId();

  return (
    <Stack>
      <Link href={`#${id}`}>{t("skip")}</Link>
      <Target id={id}>
        <Tile>{t("content")}</Tile>
      </Target>
    </Stack>
  );
}

/**
 * The link and its target.
 */
export const pair: Scene = {
  about: "skip-nav.pair.about",
  draw: Pair,
  title: "skip-nav.pair.title",
};

export default specimen({
  about: "skip-nav.about",
  group: "Accessibility",
  id: "a11y/skip-nav",
  scenes: [pair],
  title: "skip-nav.title",
});
