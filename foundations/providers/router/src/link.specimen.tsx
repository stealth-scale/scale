/**
 * Catalogue page for the route link.
 *
 * @remarks
 *   `RouteLink` has no recipe, so both scenes are hand-written. The links resolve against the
 *   routes the catalogue compiles, because the catalogue's route map is the one mounted around a
 *   specimen. The resolving scene renders the open example once per route ID and states the first
 *   ID as `Scene.props`. The sentence scene resolves an ID with `useRouteHref` and links to the
 *   path through `createLink(Link)`, which gives the link the navigation package's styles. The
 *   layout and typography packages are development dependencies, because only the catalogue reads
 *   this file. The words are keys under `route-link` in `locales/en/specimen/route-link.json`.
 */

import { Matrix, type Scene, specimen } from "@stealthscale/specimen";

import * as examples from "#examples/index.ts";

/**
 * IDs of three routes the catalogue compiles.
 *
 * @remarks
 *   A specimen page's route ID is its address with the slashes replaced by dots, under the
 *   `specimen` prefix.
 */
const ROUTES = [
  "specimen.components.actions.button",
  "specimen.components.forms.input",
  "specimen.components.typography.text",
] as const;

/**
 * Hand-written scene for route IDs resolved through the route map.
 */
export const resolving: Scene = {
  about: "route-link.resolving.about",
  draw: () => (
    <Matrix knob="to" of={ROUTES}>
      {(to) => <examples.open.Open to={to} />}
    </Matrix>
  ),
  example: examples.open,
  props: { to: ROUTES[0] },
  title: "route-link.resolving.title",
};

/**
 * Hand-written scene for a route link inside a sentence.
 */
export const inline: Scene = {
  about: "route-link.inline.about",
  draw: examples.sentence.Sentence,
  example: examples.sentence,
  title: "route-link.inline.title",
};

export default specimen({
  about: "route-link.about",
  id: "foundations/router/link",
  imports: 'import { RouteLink } from "@stealthscale/provider-router";',
  scenes: [resolving, inline],
  title: "route-link.title",
});
