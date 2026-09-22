/**
 * Shows the heading: every size, the display role, every ink, both effects, the motions and a line
 * cut short.
 *
 * @remarks
 *   The scenes are generated from the recipe, so an axis added to it reaches the page without this
 *   file changing. Every heading is drawn as an `h3`, under the scene's own `h2`, so the page's
 *   outline stays in order whatever size a heading takes.
 *   Each axis carries the title it reads best against, and the three axes that show nothing at the
 *   middle size are held at the loudest one: the display role, the effects and the gradient all
 *   need the words large enough to carry them. The display role turns off and on at one size
 *   rather than climbing the three sizes it reaches, because the axis is the role and the size axis
 *   has a scene of its own.
 *   The words are keys under `heading` in the catalogue's namespace, kept beside this file in
 *   `locales/en/specimen/heading.json`.
 */

import { type ReactElement } from "react";

import { Room, scenesOf, specimen, useWords } from "@stealthscale/specimen";

import { Heading, type HeadingProps } from "#heading/heading.ts";
import { recipe } from "#heading/recipe.ts";

/**
 * The call site every scene's source snippet is generated from.
 */
const SAMPLE = {
  children: "Quarterly report",
  imports: 'import { Heading } from "@stealthscale/component-typography";',
  name: "Heading",
};

/**
 * Draws the title of a report, which is what a size is read against.
 */
function Report(props: HeadingProps): ReactElement {
  const { t } = useWords("heading");

  return (
    <Heading as="h3" {...props}>
      {t("quarterly")}
    </Heading>
  );
}

/**
 * Draws the title of a settings page, which is what an ink is read against.
 */
function Settings(props: HeadingProps): ReactElement {
  const { t } = useWords("heading");

  return (
    <Heading as="h3" {...props}>
      {t("settings")}
    </Heading>
  );
}

/**
 * Draws a greeting, which is what the loudest role and its effects are read against.
 */
function Greeting(props: HeadingProps): ReactElement {
  const { t } = useWords("heading");

  return (
    <Heading as="h3" {...props}>
      {t("welcome")}
    </Heading>
  );
}

/**
 * Draws the title of a release, which is what a motion is read against.
 */
function Release(props: HeadingProps): ReactElement {
  const { t } = useWords("heading");

  return (
    <Heading as="h3" {...props}>
      {t("release")}
    </Heading>
  );
}

/**
 * Draws a long title, cut to the line or left to wrap.
 *
 * @remarks
 *   The title stands in a room at the large measure, because a heading cut short and one left to
 *   wrap read the same until the width runs out, and a cell of the catalogue gave a title of eighty
 *   characters the whole page.
 */
function Winding(props: HeadingProps): ReactElement {
  const { t } = useWords("heading");

  return (
    <Room size="lg">
      <Heading as="h3" {...props}>
        {t("winding")}
      </Heading>
    </Room>
  );
}

export default specimen({
  about: "heading.about",
  id: "components/typography/heading",
  imports: 'import { Heading } from "@stealthscale/component-typography";',
  scenes: scenesOf<HeadingProps>(recipe, {
    axes: {
      display: { draw: (props) => <Greeting {...props} />, with: { size: "2xl" } },
      effect: { draw: (props) => <Greeting {...props} />, with: { size: "2xl" } },
      motion: { draw: (props) => <Release {...props} /> },
      tone: { draw: (props) => <Settings {...props} /> },
      truncate: { direction: "column", draw: (props) => <Winding {...props} /> },
    },
    draw: (props) => <Report {...props} />,
    namespace: "heading",
    order: ["size", "display", "tone", "effect", "motion", "truncate"],
    sample: SAMPLE,
  }),
  title: "heading.title",
});
