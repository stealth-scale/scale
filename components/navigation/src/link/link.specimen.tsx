/**
 * Shows the link: both looks, and a link in its own ink beside one inheriting the line's, each
 * inside a line of ordinary words.
 *
 * @remarks
 *   The scenes are generated from the recipe, so an axis added to it reaches the page without this
 *   file changing. The link sits in a paragraph, because a link is found against the words around
 *   it, and the paragraph the inheriting link sits in is drawn in the muted ink, because a link
 *   that takes the line's ink shows nothing against a line drawn in the ink it would have taken
 *   anyway. The words are keys under `link` in the catalogue's namespace, kept beside this file in
 *   `locales/en/specimen/link.json`.
 */

import { type ReactElement } from "react";

import { Text } from "@stealthscale/component-typography";
import { scenesOf, specimen, useWords } from "@stealthscale/specimen";

import { Link, type LinkProps } from "#link/link.ts";
import { recipe } from "#link/recipe.ts";

/**
 * The call site every scene's source snippet is generated from.
 */
const SAMPLE = {
  children: "the terms",
  imports: 'import { Link } from "@stealthscale/component-navigation";',
  name: "Link",
};

/**
 * Draws the link inside a line of ordinary words.
 */
function Sentence(props: LinkProps): ReactElement {
  const { t } = useWords("link");

  return (
    <Text>
      {t("before")}{" "}
      <Link href="#terms" {...props}>
        {t("terms")}
      </Link>
      {t("after")}
    </Text>
  );
}

/**
 * Draws the link inside a line already drawn in the muted ink.
 */
function Muted(props: LinkProps): ReactElement {
  const { t } = useWords("link");

  return (
    <Text tone="muted">
      {t("before")}{" "}
      <Link href="#terms" {...props}>
        {t("terms")}
      </Link>
      {t("after")}
    </Text>
  );
}

export default specimen({
  about: "link.about",
  id: "components/navigation/link",
  imports: 'import { Link } from "@stealthscale/component-navigation";',
  scenes: scenesOf<LinkProps>(recipe, {
    axes: { inherit: { draw: (props) => <Muted {...props} /> } },
    draw: (props) => <Sentence {...props} />,
    namespace: "link",
    order: ["variant", "inherit"],
    sample: SAMPLE,
  }),
  title: "link.title",
});
