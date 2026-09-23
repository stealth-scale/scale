/**
 * Lays out the catalogue page for the router's declared link.
 *
 * @remarks
 *   The link ships no recipe: it is the router's own behaviour wrapped round whatever component a
 *   caller hands it, and the look belongs to that component. There is no axis to generate a scene
 *   from and no recipe specification to ask what this page covers, so every scene is written by
 *   hand and stays that way.
 *   The scenes draw real links against the routes the catalogue itself compiled, so what a reader
 *   sees resolves and navigates rather than standing in for something that would. Every address on
 *   the page is a page of this catalogue, which is the one route map a specimen can count on being
 *   mounted inside.
 *   The page reaches for the layout and typography packages, which a foundation does not otherwise
 *   do. A specimen is read by the catalogue and packed into nothing, so the reach is a development
 *   dependency and not a line in what this package publishes.
 *   The copy is keyed under `link` in the catalogue namespace and stored beside this file at
 *   `locales/en/specimen/link.json`.
 */

import { type ReactElement } from "react";

import { Stack } from "@stealthscale/component-layout";
import { Link } from "@stealthscale/component-navigation";
import { Text } from "@stealthscale/component-typography";
import { createLink, RouteLink } from "@stealthscale/provider-router";
import { Matrix, type Scene, specimen, useWords, written } from "@stealthscale/specimen";

/**
 * Draws a route link that carries a link's ink and its underline.
 *
 * @remarks
 *   `RouteLink` resolves an identifier and draws a bare `a`, which the page's reset leaves in the
 *   ink of the words around it. Set in a sentence it was a run of body text nobody could tell from
 *   the rest, so this page draws it through the navigation package's link, which is what a caller
 *   with a design system does.
 */
const Inlined = createLink(Link);

/**
 * The identifiers of routes the catalogue compiles, which the scenes resolve.
 *
 * @remarks
 *   A page's route is named for its address with the slashes turned into dots, under the prefix
 *   every specimen page is compiled beneath.
 */
const ROUTES = [
  "specimen.components.actions.button",
  "specimen.components.forms.input",
  "specimen.components.typography.text",
] as const;

/**
 * The call site each scene's source is generated from.
 */
const SAMPLE = {
  children: "Open the page",
  imports: 'import { RouteLink } from "@stealthscale/provider-router";',
  name: "RouteLink",
};

/**
 * Draws one link per route, each resolving its identifier through the map.
 */
function Resolving(): ReactElement {
  const { t } = useWords("link");

  return (
    <Matrix knob="to" of={ROUTES}>
      {(to) => <RouteLink to={to}>{t("opens")}</RouteLink>}
    </Matrix>
  );
}

/**
 * Draws a link beside the words around it, so a sentence keeps its line.
 */
function Inline(): ReactElement {
  const { t } = useWords("link");

  return (
    <Stack gap="sm">
      <Text>
        {t("before")} <Inlined to="specimen.components.actions.button">{t("named")}</Inlined>{" "}
        {t("after")}
      </Text>
    </Stack>
  );
}

/**
 * The scene resolving an identifier through the route map.
 */
export const resolving: Scene = {
  about: "link.resolving.about",
  draw: Resolving,
  source: written(SAMPLE, { to: "specimen.components.actions.button" }),
  title: "link.resolving.title",
};

/**
 * The scene drawing a link inside a line of words.
 */
export const inline: Scene = {
  about: "link.inline.about",
  draw: Inline,
  source: written(SAMPLE, { to: "specimen.components.actions.button" }),
  title: "link.inline.title",
};

export default specimen({
  about: "link.about",
  id: "foundations/router/link",
  imports: 'import { RouteLink } from "@stealthscale/provider-router";',
  scenes: [resolving, inline],
  title: "link.title",
});
