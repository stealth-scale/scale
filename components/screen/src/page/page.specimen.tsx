/**
 * Catalogue page for the page.
 *
 * @remarks
 *   `scenesOf` generates the measures, the sizes, the gutters, the alignments and the rules from
 *   the invoice example. The page sets `folded` from its own width, so the folding, navigation and
 *   context scenes render their examples in a narrow and a wide room instead of a generated scene.
 *   The navigation scene names each cell's `nav` after its room, so the two landmarks have distinct
 *   names. The bands scene renders the banner, the toolbar, the aside and the footer. The rooms and
 *   the names never appear in the examples. The words are keys under `page` in
 *   `locales/en/specimen/page.json`.
 */

import { type ReactElement } from "react";

import {
  landmarked,
  Matrix,
  Room,
  type Scene,
  scenesOf,
  specimen,
  useWords,
} from "@stealthscale/specimen";

import * as examples from "#page/examples/index.ts";
import type * as Page from "#page/index.ts";
import { recipe } from "#page/recipe.ts";

/**
 * Rooms of the folding scenes: one narrower than the `md` breakpoint and one wider.
 */
const ROOMS = ["sm", "4xl"] as const;

/**
 * Hand-written scene for the header of a folded page.
 */
export const folding: Scene = {
  about: "page.folding.about",
  axes: ["folded"],
  draw: () => (
    <Matrix direction="column" knob="room" of={ROOMS}>
      {(room) => (
        <Room size={room}>
          <examples.invoice.Invoice />
        </Room>
      )}
    </Matrix>
  ),
  example: examples.invoice,
  title: "page.folding.title",
};

/**
 * Describes the props of the named settings page.
 */
interface NamedProps {
  /**
   * The room the page renders in.
   */
  readonly room: (typeof ROOMS)[number];
}

/**
 * Renders the settings example in a room, with a navigation name that includes the room.
 *
 * @remarks
 *   Both cells render a `nav`, and two landmarks with one name fail axe `landmark-unique`. The name
 *   is set here, so the example's source keeps its single label.
 */
function Named({ room }: NamedProps): ReactElement {
  const { t } = useWords("page");

  return (
    <Room size={room}>
      <examples.settings.Settings aria-label={landmarked(t("sections"), { room })} />
    </Room>
  );
}

/**
 * Hand-written scene for the navigation band, with links on a wide page and a picker on a narrow
 * one.
 */
export const navigation: Scene = {
  about: "page.navigation.about",
  draw: () => (
    <Matrix direction="column" knob="room" of={ROOMS}>
      {(room) => <Named room={room} />}
    </Matrix>
  ),
  example: examples.settings,
  title: "page.navigation.title",
};

/**
 * Hand-written scene for the context row, with a breadcrumb trail on a wide page and a link back
 * on a narrow one.
 */
export const context: Scene = {
  about: "page.context.about",
  draw: () => (
    <Matrix direction="column" knob="room" of={ROOMS}>
      {(room) => (
        <Room size={room}>
          <examples.project.Project />
        </Room>
      )}
    </Matrix>
  ),
  example: examples.project,
  title: "page.context.title",
};

/**
 * Hand-written scene for the banner, the toolbar, the aside and the footer.
 */
export const bands: Scene = {
  about: "page.bands.about",
  draw: examples.workspace.Workspace,
  example: examples.workspace,
  title: "page.bands.title",
};

export default specimen({
  about: "page.about",
  id: "components/screen/page",
  imports: 'import { Page } from "@stealthscale/component-screen";',
  scenes: [
    ...scenesOf<Page.RootProps>(recipe, {
      axes: {
        align: { direction: "column", with: { measure: "narrow" } },
        divided: { direction: "column" },
        gutter: { direction: "column" },
        measure: { direction: "column" },
        size: { direction: "column" },
      },
      draw: (props) => <examples.invoice.Invoice {...props} />,
      example: examples.invoice,
      namespace: "page",
      order: ["measure", "size", "gutter", "align", "divided"],
      skip: {
        folded: "The page sets folded from its own width, and the folding scene renders it.",
      },
    }),
    folding,
    navigation,
    context,
    bands,
  ],
  title: "page.title",
});
