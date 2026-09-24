/**
 * Catalogue page for the sidebar.
 *
 * @remarks
 *   `scenesOf` generates the looks from the workspace example in an `xs` room, the width of a
 *   sidebar. The sizes scene renders the sizes example, because the navigation list and the search
 *   field take the size through their own props. The rail scene renders without a room, because a
 *   rail is as wide as its icons. The filter scene types a query that matches no page into the
 *   example's own field, so the empty message renders. The rooms and the typing never appear in
 *   the examples. The looks scene renders four copies of one example, so the page repeats the
 *   names of its nav landmarks. The words are keys under `sidebar` in
 *   `locales/en/specimen/sidebar.json`.
 */

import { type ReactElement, type ReactNode, useEffect, useState } from "react";

import { Room, type Scene, scenesOf, specimen, useWords } from "@stealthscale/specimen";

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
  imports: 'import { Sidebar } from "@stealthscale/component-screen";',
  scenes: [
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
