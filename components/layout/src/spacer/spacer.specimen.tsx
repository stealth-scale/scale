/**
 * Catalogue page for the spacer.
 *
 * @remarks
 *   The recipe has no axis, so the page has one hand-written scene: a page header in a 672px room,
 *   whose spacer pushes two buttons to the end of the row. `uncovered` in the recipe spec fails
 *   when an axis is added and no scene renders it. The scene renders a component from `examples/`
 *   and shows that file as its source. The words are keys under `spacer` in
 *   `locales/en/specimen/spacer.json`.
 */

import { type ReactElement } from "react";

import { Room, type Scene, specimen } from "@stealthscale/specimen";

import * as header from "#spacer/examples/header.example.tsx";

/**
 * Renders the page header in a 672px room.
 */
function Header(): ReactElement {
  return (
    <Room size="2xl">
      <header.Header />
    </Room>
  );
}

/**
 * Hand-written scene for a spacer between a heading and its actions.
 */
export const heading: Scene = {
  about: "spacer.header.about",
  draw: Header,
  example: header,
  title: "spacer.header.title",
};

export default specimen({
  about: "spacer.about",
  id: "components/layout/spacer",
  imports: 'import { Spacer } from "@stealthscale/component-layout";',
  scenes: [heading],
  title: "spacer.title",
});
