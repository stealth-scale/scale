/**
 * Shows the list: both looks, every marker, every gap, the alignments of a plain entry's mark, and
 * the motions.
 *
 * @remarks
 *   The scenes are generated from the recipe, so an axis added to it reaches the page without this
 *   file changing. Each axis carries the entries it reads best against: three groceries where the
 *   axis turns the marker, the gap or the motion, entries that draw their own mark where it turns
 *   the look, and one entry long enough to wrap where it places that mark.
 *   A marker that counts is drawn on an ordered list, so the numbers mean something. The words are
 *   keys under `list` in the catalogue's namespace, kept beside this file in
 *   `locales/en/specimen/list.json`.
 */

import { type ReactElement } from "react";

import { Room, scenesOf, specimen, useWords } from "@stealthscale/specimen";

import * as List from "#list/index.ts";
import { recipe } from "#list/recipe.ts";

/**
 * The markers that count, which an ordered list draws.
 */
const COUNTING = new Set([
  "decimal",
  "leading-zero",
  "lower-roman",
  "upper-roman",
  "lower-alpha",
  "upper-alpha",
  "lower-greek",
]);

/**
 * The call site every scene's source snippet is generated from.
 */
const SAMPLE = {
  children: [
    "<List.Item>Milk</List.Item>",
    "<List.Item>Bread</List.Item>",
    "<List.Item>Butter</List.Item>",
  ].join("\n"),
  imports: 'import { List } from "@stealthscale/component-typography";',
  name: "List.Root",
};

/**
 * Draws three groceries as plain entries.
 */
function Groceries(): ReactElement {
  const { t } = useWords("list");

  return (
    <>
      <List.Item>{t("milk")}</List.Item>
      <List.Item>{t("bread")}</List.Item>
      <List.Item>{t("butter")}</List.Item>
    </>
  );
}

/**
 * Draws the groceries under whatever the scene hands over.
 */
function Shopping(props: List.RootProps): ReactElement {
  return (
    <List.Root {...props}>
      <Groceries />
    </List.Root>
  );
}

/**
 * Draws the groceries under the marker the scene hands over, on the element that marker needs.
 *
 * @remarks
 *   A marker that counts belongs on an ordered list, so the numbers stand for the order of the
 *   entries rather than decorating them.
 */
function Marked({ marker, ...rest }: List.RootProps): ReactElement {
  const counting = typeof marker === "string" && COUNTING.has(marker);

  return (
    <Shopping as={counting ? "ol" : "ul"} {...(marker === undefined ? {} : { marker })} {...rest} />
  );
}

/**
 * Draws the groceries, the plain look carrying a mark of its own on each entry.
 *
 * @remarks
 *   The mark is drawn for the plain look alone. The browser's marker already draws one, and an
 *   entry carrying both reads as two lists laid over each other.
 */
function Checked({ variant, ...rest }: List.RootProps): ReactElement {
  const { t } = useWords("list");
  const own = variant === "plain";

  return (
    <List.Root {...(variant === undefined ? {} : { variant })} {...rest}>
      <List.Item>
        {own ? <List.Indicator>✓</List.Indicator> : null}
        {t("milk")}
      </List.Item>
      <List.Item>
        {own ? <List.Indicator>✓</List.Indicator> : null}
        {t("bread")}
      </List.Item>
      <List.Item>
        {own ? <List.Indicator>✗</List.Indicator> : null}
        {t("butter")}
      </List.Item>
    </List.Root>
  );
}

/**
 * Draws a plain entry running to more than one line, with its own mark beside it.
 *
 * @remarks
 *   The entry stands in a room at the smallest measure, which is what makes it run to a second
 *   line: given a cell of the catalogue it sat on one, and the three places read the same.
 */
function Wrapped(props: List.RootProps): ReactElement {
  const { t } = useWords("list");

  return (
    <Room size="xs">
      <List.Root variant="plain" {...props}>
        <List.Item>
          <List.Indicator>✓</List.Indicator>
          {t("note")}
        </List.Item>
      </List.Root>
    </Room>
  );
}

export default specimen({
  about: "list.about",
  id: "components/typography/list",
  imports: 'import { List } from "@stealthscale/component-typography";',
  scenes: scenesOf<List.RootProps>(recipe, {
    axes: {
      align: { draw: (props) => <Wrapped {...props} /> },
      marker: { draw: (props) => <Marked {...props} /> },
      variant: { draw: (props) => <Checked {...props} /> },
    },
    draw: (props) => <Shopping {...props} />,
    namespace: "list",
    order: ["variant", "marker", "gap", "align", "motion"],
    sample: SAMPLE,
  }),
  title: "list.title",
});
