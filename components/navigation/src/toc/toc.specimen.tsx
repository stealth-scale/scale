/**
 * Shows the table of contents: every size with the mark on one heading, and a rail following the
 * reader down three headed passages.
 *
 * @remarks
 *   The size scene is generated from the recipe, so a step added to the theme reaches the page
 *   without this file changing. The following scene is written by hand, because what the mark
 *   follows is the headings on the page rather than an axis of the recipe. That scene is also
 *   where the placement axis is drawn: a sticky rail and a static one are the same drawing until
 *   the page under them scrolls, so a generated scene of the two would show one rail twice.
 *   The sized rails list headings no passage on the page carries, so the mark stays on the heading
 *   the scene put it on rather than moving as a reader scrolls. The passages the following rail
 *   tracks are headed as `h3`, under the scene's own `h2`, so three passages drawn to be scrolled
 *   past do not read as three sections of this page. The words are keys under `toc` in the
 *   catalogue's namespace, kept beside this file in `locales/en/specimen/toc.json`.
 */

import { type ReactElement } from "react";

import { Grid, Stack } from "@stealthscale/component-layout";
import { Heading, Text } from "@stealthscale/component-typography";
import { type Scene, scenesOf, specimen, useWords } from "@stealthscale/specimen";

import * as Toc from "#toc/index.ts";
import { type TocItem } from "#toc/machine.ts";
import { recipe } from "#toc/recipe.ts";

/**
 * The call site the generated scene's source snippet is built from.
 */
const SAMPLE = {
  children: [
    "<Toc.Title>On this page</Toc.Title>",
    "<Toc.List>",
    "  <Toc.Item item={item}>…</Toc.Item>",
    "</Toc.List>",
  ].join("\n"),
  imports: 'import { Toc } from "@stealthscale/component-navigation";',
  name: "Toc.Root",
};

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
 * The paragraphs each passage is written out of.
 *
 * @remarks
 *   Three of them rather than one line. A rail follows the reader down a page, and a passage a
 *   reader cannot scroll through never moves the mark off the heading it started on: the scene
 *   showed a rail that never followed anything.
 */
const PARAGRAPHS = ["passage", "second", "third"] as const;

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
   * Where the rail is placed against the page it lists, or the recipe's default.
   */
  readonly placement?: "aside" | "inline" | undefined;

  /**
   * The size the rail is read at, or the recipe's default.
   */
  readonly size?: "lg" | "md" | "sm" | undefined;
}

/**
 * Draws one rail over a set of headings, each row worded from the heading's key, with the mark on
 * the second heading.
 *
 * @remarks
 *   The root is drawn as a `div`. A rail is a `nav` named by its own title, so every drawing on
 *   this page would be a landmark called `On this page`, and so is the catalogue's own rail beside
 *   them.
 */
function Rail({ items, placement, size }: RailProps): ReactElement {
  const { t } = useWords("toc");

  const sized = size === undefined ? {} : { size };
  const placed = placement === undefined ? {} : { placement };

  return (
    <Toc.Root
      as="div"
      defaultActiveIds={[items[1]?.value ?? ""]}
      items={[...items]}
      {...placed}
      {...sized}
    >
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
 * Draws a rail over headings no passage on the page carries, so the mark stays where it is put.
 */
function Listed(props: Pick<RailProps, "placement" | "size">): ReactElement {
  return <Rail items={LISTED} {...props} />;
}

/**
 * Draws a rail over three headed passages on the page, which the mark follows as the page
 * scrolls.
 */
function Following(): ReactElement {
  const { t } = useWords("toc");

  return (
    <Grid.Root columns="3" gap="xl">
      <Grid.Item span="2">
        <Stack gap="lg">
          {PASSAGES.map((item) => (
            <Stack gap="sm" key={item.value}>
              <Heading as="h3" id={item.value} size="md">
                {t(`headings.${item.value}`)}
              </Heading>
              {PARAGRAPHS.map((paragraph) => (
                <Text key={paragraph}>{t(paragraph)}</Text>
              ))}
            </Stack>
          ))}
        </Stack>
      </Grid.Item>
      <Grid.Item>
        <Rail items={PASSAGES} placement="aside" />
      </Grid.Item>
    </Grid.Root>
  );
}

/**
 * A rail following the reader.
 */
export const following: Scene = {
  about: "toc.following.about",
  axes: ["placement"],
  draw: Following,
  title: "toc.following.title",
};

export default specimen({
  about: "toc.about",
  id: "components/navigation/toc",
  imports: 'import { Toc } from "@stealthscale/component-navigation";',
  scenes: [
    ...scenesOf<Pick<RailProps, "placement" | "size">>(recipe, {
      draw: (props) => <Listed {...props} />,
      namespace: "toc",
      sample: SAMPLE,
      skip: {
        placement:
          "drawn by the following scene, where a page long enough to scroll is what tells the two placements apart",
      },
    }),
    following,
  ],
  title: "toc.title",
});
