/**
 * Catalogue page for the page.
 *
 * @remarks
 *   Every scene renders its page in a screen box, which renders the page's edges. The folding, the
 *   tabbed and the navigation scenes render their page twice: wide, and in a room a phone's width,
 *   because a page folds on its own width. The sticking scene renders its page in a box 20rem tall
 *   that scrolls, so the bands stick to the box. The first eight scenes follow the order a reader
 *   meets the parts in. `scenesOf` generates the gutters, the alignments and the rules from the
 *   measured example. The boxes and the rooms never appear in
 *   the examples. The words are keys under `page` in `locales/en/specimen/page.json`. The kit
 *   defines `page.back`, `page.failed` and `page.reload` in the same namespace, so the failure
 *   scene's words are under `page.failure`.
 */

import { type ComponentType, type ReactElement } from "react";

import { Stack } from "@stealthscale/component-layout";
import { Room, type Scene, scenesOf, Screen, specimen } from "@stealthscale/specimen";

import * as examples from "#page/examples/index.ts";
import type * as Page from "#page/index.ts";
import { recipe } from "#page/recipe.ts";

/**
 * Describes the props of the wide and narrow staging.
 */
interface BothProps {
  /**
   * The example to render twice.
   */
  readonly page: ComponentType;
}

/**
 * Renders an example in a screen box at the scene's width and in a room a phone's width.
 */
function Both({ page: Shown }: BothProps): ReactElement {
  return (
    <Stack gap="xl">
      <Screen>
        <Shown />
      </Screen>
      <Room size="sm">
        <Screen>
          <Shown />
        </Screen>
      </Room>
    </Stack>
  );
}

/**
 * Hand-written scene for a header and each of its parts.
 */
export const header: Scene = {
  about: "page.header.about",
  draw: () => (
    <Screen>
      <examples.deployment.Deployment />
    </Screen>
  ),
  example: examples.deployment,
  title: "page.header.title",
};

/**
 * Hand-written scene for a page wide and folded at a phone's width.
 */
export const folding: Scene = {
  about: "page.folding.about",
  axes: ["folded"],
  draw: () => <Both page={examples.users.Users} />,
  example: examples.users,
  title: "page.folding.title",
};

/**
 * Hand-written scene for tabs and a toolbar on the navigation band.
 */
export const tabbed: Scene = {
  about: "page.tabbed.about",
  draw: () => <Both page={examples.tokens.Tokens} />,
  example: examples.tokens,
  title: "page.tabbed.title",
};

/**
 * Hand-written scene for the bands that stick while the page scrolls.
 */
export const sticking: Scene = {
  about: "page.sticking.about",
  draw: () => (
    <Screen scrolls size="xs">
      <examples.notifications.Notifications />
    </Screen>
  ),
  example: examples.notifications,
  title: "page.sticking.title",
};

/**
 * Hand-written scene for links in the navigation band and the menu that replaces them.
 */
export const navigation: Scene = {
  about: "page.navigation.about",
  draw: () => <Both page={examples.settings.Settings} />,
  example: examples.settings,
  title: "page.navigation.title",
};

/**
 * Hand-written scene for the banner, the toolbar band, the aside and the footer.
 */
export const bands: Scene = {
  about: "page.bands.about",
  draw: () => (
    <Screen>
      <examples.workspace.Workspace />
    </Screen>
  ),
  example: examples.workspace,
  title: "page.bands.title",
};

/**
 * Measures the measures scene renders, from the narrowest.
 */
const MEASURES = ["narrow", "wide", "full"] as const;

/**
 * Hand-written scene for the three measures.
 */
export const measures: Scene = {
  about: "page.measure.about",
  axes: ["measure"],
  draw: () => (
    <Stack gap="xl">
      {MEASURES.map((measure) => (
        <Screen key={measure}>
          <examples.measured.Measured measure={measure} />
        </Screen>
      ))}
    </Stack>
  ),
  example: examples.measured,
  props: { measure: "narrow" } satisfies Page.RootProps,
  title: "page.measure.title",
};

/**
 * Sizes the sizes scene renders, from the smallest.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * Hand-written scene for the three sizes.
 */
export const sizes: Scene = {
  about: "page.size.about",
  axes: ["size"],
  draw: () => (
    <Stack gap="xl">
      {SIZES.map((size) => (
        <Screen key={size}>
          <examples.users.Users size={size} />
        </Screen>
      ))}
    </Stack>
  ),
  example: examples.users,
  props: { size: "sm" } satisfies Page.RootProps,
  title: "page.size.title",
};

/**
 * Hand-written scene for a page whose content is loading.
 */
export const loading: Scene = {
  about: "page.loading.about",
  draw: () => (
    <Screen>
      <examples.loading.Loading />
    </Screen>
  ),
  example: examples.loading,
  title: "page.loading.title",
};

/**
 * Hand-written scene for a page whose content failed to load.
 */
export const failed: Scene = {
  about: "page.failure.about",
  draw: () => (
    <Screen>
      <examples.failed.Failed />
    </Screen>
  ),
  example: examples.failed,
  title: "page.failure.title",
};

export default specimen({
  about: "page.about",
  id: "components/screen/page",
  imports: 'import { Page } from "@stealthscale/component-screen";',
  scenes: [
    header,
    folding,
    tabbed,
    sticking,
    measures,
    sizes,
    loading,
    failed,
    navigation,
    bands,
    ...scenesOf<Page.RootProps>(recipe, {
      axes: {
        align: { direction: "column" },
        divided: { direction: "column" },
        gutter: { direction: "column" },
      },
      draw: (props) => (
        <Screen>
          <examples.measured.Measured {...props} />
        </Screen>
      ),
      example: examples.measured,
      namespace: "page",
      order: ["gutter", "align", "divided"],
      skip: {
        folded: "The page sets folded from its own width, and the folding scene renders it.",
        measure: "The measures scene renders every measure in a box wider than the narrow one.",
        size: "The sizes scene renders every size with its tabs and actions.",
      },
    }),
  ],
  title: "page.title",
});
