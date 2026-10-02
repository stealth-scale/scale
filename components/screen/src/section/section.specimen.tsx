/**
 * Catalogue page for the section.
 *
 * @remarks
 *   The settings scene renders the settings example in a screen box, because a page renders its
 *   gutter at its own edges. The annotated and the folding scenes render their cards twice: in a
 *   room wider than the width the section folds at, and in a room a phone's width, because a
 *   section folds on its own width. The sizes scene renders one page per size in a screen box. The
 *   boxes and the rooms never appear in the examples. The words are keys under `section` in
 *   `locales/en/specimen/section.json`.
 */

import { Stack } from "@stealthscale/component-layout";
import { Room, type Scene, Screen, specimen } from "@stealthscale/specimen";

import type * as Page from "#page/index.ts";
import * as examples from "#section/examples/index.ts";
import type * as Section from "#section/index.ts";

/**
 * Hand-written scene for a settings page of plain sections and a card.
 */
export const settings: Scene = {
  about: "section.settings.about",
  draw: () => (
    <Screen>
      <examples.settings.Settings />
    </Screen>
  ),
  example: examples.settings,
  title: "section.settings.title",
};

/**
 * Hand-written scene for two sections raised as cards.
 */
export const cards: Scene = {
  about: "section.variant.about",
  axes: ["variant"],
  draw: () => (
    <Stack gap="lg">
      <examples.cards.Cards />
    </Stack>
  ),
  example: examples.cards,
  title: "section.variant.title",
};

/**
 * Hand-written scene for the header in a column beside the cards, wide and at a phone's width.
 */
export const annotated: Scene = {
  about: "section.annotated.about",
  axes: ["annotated"],
  draw: () => (
    <Stack gap="xl">
      <Room size="4xl">
        <Stack gap="lg">
          <examples.cards.Cards annotated />
        </Stack>
      </Room>
      <Room size="sm">
        <Stack gap="lg">
          <examples.cards.Cards annotated />
        </Stack>
      </Room>
    </Stack>
  ),
  example: examples.cards,
  props: { annotated: true } satisfies Section.RootProps,
  title: "section.annotated.title",
};

/**
 * Hand-written scene for one card wide and folded at a phone's width.
 */
export const folding: Scene = {
  about: "section.folding.about",
  draw: () => (
    <Stack gap="xl">
      <examples.members.Members />
      <Room size="sm">
        <examples.members.Members />
      </Room>
    </Stack>
  ),
  example: examples.members,
  title: "section.folding.title",
};

/**
 * Sizes the sizes scene renders, from the largest.
 */
const SIZES = ["lg", "md", "sm"] as const;

/**
 * Hand-written scene for the three sizes, each on a page of that size.
 */
export const sizes: Scene = {
  about: "section.size.about",
  axes: ["size"],
  draw: () => (
    <Stack gap="xl">
      {SIZES.map((size) => (
        <Screen key={size}>
          <examples.sizes.Sizes size={size} />
        </Screen>
      ))}
    </Stack>
  ),
  example: examples.sizes,
  props: { size: "lg" } satisfies Page.RootProps,
  title: "section.size.title",
};

export default specimen({
  about: "section.about",
  id: "components/screen/section",
  imports: 'import { Section } from "@stealthscale/component-screen";',
  scenes: [settings, cards, annotated, folding, sizes],
  title: "section.title",
});
