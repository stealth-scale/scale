/**
 * Catalogue page for the sidebar.
 *
 * @remarks
 *   The first three scenes render an operations console: in full in a box as wide as a sidebar, in
 *   an app shell whose navigation closes to icons, and in the same shell at a phone's width. The
 *   kit's `Screen` gives each shell a window of a fixed height and contains the phone's sheet.
 *   `scenesOf` generates the looks from the workspace example in an `xs` room, the width of a
 *   sidebar. The sizes scene renders the sizes example, because the search field takes the size
 *   through the sidebar. The rail scene renders without a room, because a rail is as wide as its
 *   icons. The filter scene types a query that matches no page into the example's own field, so
 *   the empty message renders. The rooms, the boxes and the typing never appear in the examples.
 *   The words are keys under `sidebar` in `locales/en/specimen/sidebar.json`.
 */

import { type ReactElement, type ReactNode, useEffect, useState } from "react";

import {
  Room,
  Sample,
  type Scene,
  scenesOf,
  Screen,
  specimen,
  useWords,
} from "@stealthscale/specimen";

import * as examples from "#sidebar/examples/index.ts";
import type * as Sidebar from "#sidebar/index.ts";
import { recipe } from "#sidebar/recipe.ts";

/**
 * Describes the props of the typing staging.
 */
interface TypedProps {
  /**
   * The sidebar whose search field receives the query.
   */
  readonly children: ReactNode;
}

/**
 * Renders a sidebar and types a query into its search field after it mounts.
 *
 * @remarks
 *   The staging sets the field's value through the input element's own setter and dispatches an
 *   `input` event, so the example's change handler filters the pages the way it does under a
 *   keyboard.
 */
function Typed({ children }: TypedProps): ReactElement {
  const { t } = useWords("sidebar");
  const [box, setBox] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const input = box?.querySelector("input");

    if (input === undefined || input === null) return;

    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(
      input,
      t("query"),
    );
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }, [box, t]);

  return <div ref={setBox}>{children}</div>;
}

/**
 * Hand-written scene for the console sidebar in full.
 */
export const whole: Scene = {
  about: "sidebar.whole.about",
  draw: () => (
    <Room size="xs">
      <Sample place="stretch" variant="outline">
        <examples.console.Console />
      </Sample>
    </Room>
  ),
  example: examples.console,
  title: "sidebar.whole.title",
};

/**
 * Hand-written scene for the sidebar in an app shell panel that closes to icons.
 */
export const shell: Scene = {
  about: "sidebar.shell.about",
  draw: () => (
    <Screen size="lg">
      <examples.shell.Shell />
    </Screen>
  ),
  example: examples.shell,
  frame: "bleed",
  title: "sidebar.shell.title",
};

/**
 * Hand-written scene for the sidebar as a sheet with a bar of destinations at a phone's width.
 */
export const phone: Scene = {
  about: "sidebar.phone.about",
  draw: () => (
    <Room size="sm">
      <Screen size="lg">
        <examples.phone.Phone />
      </Screen>
    </Room>
  ),
  example: examples.phone,
  title: "sidebar.phone.title",
};

/**
 * Hand-written scene for the three sizes.
 */
export const sizes: Scene = {
  about: "sidebar.size.about",
  axes: ["size"],
  draw: () => (
    <Room size="xs">
      <examples.sizes.Sizes />
    </Room>
  ),
  example: examples.sizes,
  title: "sidebar.size.title",
};

/**
 * Hand-written scene for the sidebar collapsed to a rail.
 */
export const rail: Scene = {
  about: "sidebar.rail.about",
  draw: examples.rail.Rail,
  example: examples.rail,
  title: "sidebar.rail.title",
};

/**
 * Hand-written scene for one nav block with a heading over each list.
 */
export const headings: Scene = {
  about: "sidebar.headings.about",
  draw: () => (
    <Room size="xs">
      <examples.guides.Guides />
    </Room>
  ),
  example: examples.guides,
  title: "sidebar.headings.title",
};

/**
 * Hand-written scene for the search that matches no page.
 */
export const filtering: Scene = {
  about: "sidebar.filtering.about",
  draw: () => (
    <Room size="xs">
      <Typed>
        <examples.filter.Filter />
      </Typed>
    </Room>
  ),
  example: examples.filter,
  title: "sidebar.filtering.title",
};

export default specimen({
  about: "sidebar.about",
  id: "components/screen/sidebar",
  imports: 'import { AppShell, Sidebar } from "@stealthscale/component-screen";',
  scenes: [
    whole,
    shell,
    phone,
    ...scenesOf<Sidebar.RootProps>(recipe, {
      draw: (props) => (
        <Room size="xs">
          <examples.workspace.Workspace {...props} />
        </Room>
      ),
      example: examples.workspace,
      namespace: "sidebar",
      order: ["variant"],
      skip: {
        size: "The sizes scene renders every size with its lists and fields at the same size.",
      },
    }),
    sizes,
    rail,
    headings,
    filtering,
  ],
  title: "sidebar.title",
});
