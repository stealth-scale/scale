/**
 * Shows the icon: every size, every ink, every motion, and a pointing mark mirrored.
 *
 * @remarks
 *   The scenes are generated from the recipe, so an axis added to it reaches the page without this
 *   file changing. The artwork is two paths drawn here, an arrow and a star, in a 24 unit box. The
 *   star carries the three axes that turn how a mark is drawn, and the arrow carries the mirror,
 *   because a mark that does not point shows nothing when it turns around. The axes that show
 *   nothing at the inherited size are held at the large one, which is the size a mark drawn on its
 *   own is read at.
 *   Every icon is labelled, because the page shows the artwork and a screen reader should hear what
 *   it is. The words are keys under `icon` in the catalogue's namespace, kept beside this file in
 *   `locales/en/specimen/icon.json`.
 */

import { type ReactElement } from "react";

import { scenesOf, specimen, useWords } from "@stealthscale/specimen";

import { Icon, type IconProps } from "#icon/icon.ts";
import { recipe } from "#icon/recipe.ts";

/**
 * The path of an arrow pointing right, in a 24 unit box.
 */
const ARROW = "M5 12h14m-6-6 6 6-6 6";

/**
 * The path of a five-pointed star, in a 24 unit box.
 */
const STAR = "m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z";

/**
 * The call site every scene's source snippet is generated from.
 */
const SAMPLE = {
  children: '<path d="m12 3 2.7 5.6…" />',
  imports: 'import { Icon } from "@stealthscale/component-typography";',
  name: "Icon",
};

/**
 * Draws the star, which is a mark that shows nothing when it turns around.
 */
function Star(props: IconProps): ReactElement {
  const { t } = useWords("icon");

  return (
    <Icon aria-hidden={false} aria-label={t("star")} viewBox="0 0 24 24" {...props}>
      <path d={STAR} />
    </Icon>
  );
}

/**
 * Draws the arrow, which is a mark that points and is turned around in a right-to-left page.
 */
function Arrow(props: IconProps): ReactElement {
  const { t } = useWords("icon");

  return (
    <Icon aria-hidden={false} aria-label={t("arrow")} viewBox="0 0 24 24" {...props}>
      <path d={ARROW} fill="none" stroke="currentColor" strokeWidth="2" />
    </Icon>
  );
}

export default specimen({
  about: "icon.about",
  id: "components/typography/icon",
  imports: 'import { Icon } from "@stealthscale/component-typography";',
  scenes: scenesOf<IconProps>(recipe, {
    axes: {
      mirrored: { draw: (props) => <Arrow {...props} />, with: { size: "lg" } },
      motion: { with: { size: "lg" } },
      tone: { with: { size: "lg" } },
    },
    draw: (props) => <Star {...props} />,
    namespace: "icon",
    order: ["size", "tone", "motion", "mirrored"],
    sample: SAMPLE,
  }),
  title: "icon.title",
});
