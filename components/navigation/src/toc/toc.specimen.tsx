/**
 * Shows the table of contents: every size with the mark on one heading, and a rail following the
 * reader down three headed passages.
 *
 * @remarks
 *   The size axis is read off the recipe, so a step added to the theme reaches the page without
 *   this file changing. The words are keys under `toc` in the catalogue's namespace, kept beside
 *   this file in `locales/en/specimen/toc.json`.
 */

import { type ReactElement } from "react";

import { Heading, Text } from "@stealthscale/component-typography";
import { Matrix, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";

import * as Toc from "#toc/index.ts";
import { type TocItem } from "#toc/machine.ts";
import { recipe } from "#toc/recipe.ts";

/**
 * The headings the sized rails list, which no passage on the page carries, so the mark stays
 * where the scene puts it.
 */
const LISTED: readonly TocItem[] = [
  { depth: 2, value: "toc-overview" },
  { depth: 2, value: "toc-install" },
  { depth: 3, value: "toc-peers" },
  { depth: 2, value: "toc-usage" },
];

/**
 * The headings of the three passages the following rail lists, which the scene draws.
 */
const PASSAGES: readonly TocItem[] = [
  { depth: 2, value: "toc-first" },
  { depth: 2, value: "toc-second" },
  { depth: 2, value: "toc-third" },
];

/**
 * Describes what one rail of the page takes.
 */
interface RailProps {
  /**
   * The headings the rail lists.
   */
  readonly items: readonly TocItem[];

  /**
   * The size the rail is read at, or the recipe's default.
   */
  readonly size?: "lg" | "md" | "sm" | undefined;
}

/**
 * Draws one rail over a set of headings, each row worded from the heading's key, with the mark on
 * the second heading.
 */
function Rail({ items, size }: RailProps): ReactElement {
  const { t } = useWords("toc");

  const sized = size === undefined ? {} : { size };

  return (
    <Toc.Root defaultActiveIds={[items[1]?.value ?? ""]} items={[...items]} {...sized}>
      <Toc.Title>{t("onThisPage")}</Toc.Title>
      <Toc.List>
        <Toc.Indicator />
        {items.map((item) => (
          <Toc.Item item={item} key={item.value}>
            <Toc.Link href={`#${item.value}`} item={item}>
              {t(`headings.${item.value}`)}
            </Toc.Link>
          </Toc.Item>
        ))}
      </Toc.List>
    </Toc.Root>
  );
}

/**
 * Draws the rail at every size, the mark on the second heading.
 */
function Sizes(): ReactElement {
  return (
    <Matrix knob="size" of={valuesOf(recipe, "size")}>
      {(size) => <Rail items={LISTED} size={size} />}
    </Matrix>
  );
}

/**
 * Draws a rail over three headed passages on the page, which the mark follows as the page
 * scrolls.
 */
function Following(): ReactElement {
  const { t } = useWords("toc");

  return (
    <>
      <Rail items={PASSAGES} />
      {PASSAGES.map((item) => (
        <div key={item.value}>
          <Heading id={item.value} size="md">
            {t(`headings.${item.value}`)}
          </Heading>
          <Text>{t("passage")}</Text>
        </div>
      ))}
    </>
  );
}

/**
 * Every size.
 */
export const sizes: Scene = { about: "toc.sizes.about", draw: Sizes, title: "toc.sizes.title" };

/**
 * A rail following the reader.
 */
export const following: Scene = {
  about: "toc.following.about",
  draw: Following,
  title: "toc.following.title",
};

export default specimen({
  about: "toc.about",
  group: "Navigation",
  id: "navigation/toc",
  scenes: [sizes, following],
  title: "toc.title",
});
