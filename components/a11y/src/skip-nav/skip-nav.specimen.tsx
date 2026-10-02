/**
 * Catalogue page for the skip link and its target.
 *
 * @remarks
 *   The recipe has no axis, so the page has one hand-written scene: an invoice list whose skip link
 *   moves focus past the filters, inside `Contained`, so Tab reveals the link at the list's corner
 *   and not at the window's. At rest the scene shows what a pointer user sees, so a still image
 *   shows no link. The example takes its fragment id from `useId`, because the catalogue shell
 *   already renders a skip link to `#content`. The scene renders a component from `examples/` and
 *   shows that file as its source. The words are keys under `skip-nav` in
 *   `locales/en/specimen/skip-nav.json`.
 */

import { type ReactElement } from "react";

import { Contained, Room, type Scene, specimen } from "@stealthscale/specimen";

import * as invoices from "#skip-nav/examples/invoices.example.tsx";

/**
 * Renders the invoice list in a 512px room that contains its fixed link.
 */
function Pair(): ReactElement {
  return (
    <Room size="lg">
      <Contained>
        <invoices.Invoices />
      </Contained>
    </Room>
  );
}

/**
 * Hand-written scene for the link and the target.
 */
export const pair: Scene = {
  about: "skip-nav.pair.about",
  draw: Pair,
  example: invoices,
  title: "skip-nav.pair.title",
};

export default specimen({
  about: "skip-nav.about",
  id: "components/a11y/skip-nav",
  imports: 'import { SkipNav } from "@stealthscale/component-a11y";',
  scenes: [pair],
  title: "skip-nav.title",
});
