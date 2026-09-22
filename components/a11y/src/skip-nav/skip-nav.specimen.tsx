/**
 * Catalogue entry for the skip link and the target it jumps to.
 *
 * @remarks
 *   The recipe declares no axis, so there is nothing to generate a scene from and the one scene is
 *   written by hand. Its specification still asks what this page covers, so an axis added to the
 *   recipe fails that check until this page draws it. The scene generates its own
 *   fragment id rather than taking the default, because the catalogue shell already renders a skip
 *   link aimed at the default target and a second link to the same place would be a duplicate
 *   control. Copy comes from the `skip-nav` namespace in `locales/en/specimen/skip-nav.json`.
 */

import { type ReactElement, useId } from "react";

import { Stack } from "@stealthscale/component-layout";
import { type Scene, specimen, Tile, useWords } from "@stealthscale/specimen";

import { Link, Target } from "#skip-nav/index.ts";

/**
 * Renders a link and a target wired to a generated fragment id.
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
 * Scene showing both parts of the component wired together.
 */
export const pair: Scene = {
  about: "skip-nav.pair.about",
  draw: Pair,
  title: "skip-nav.pair.title",
};

export default specimen({
  about: "skip-nav.about",
  id: "components/a11y/skip-nav",
  imports: 'import { SkipNav } from "@stealthscale/component-a11y";',
  scenes: [pair],
  title: "skip-nav.title",
});
