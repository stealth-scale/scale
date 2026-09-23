/**
 * Catalogue page for the route link.
 *
 * @remarks
 *   `RouteLink` has no recipe, so `scenesOf` has no axes to generate scenes from and both scenes
 *   are hand-written. The links resolve against the routes the catalogue compiles, because the
 *   catalogue's route map is the only one mounted around a specimen. The layout and typography
 *   packages are development dependencies, because only the catalogue reads this file. The words
 *   are keys under `route-link` in `locales/en/specimen/route-link.json`.
 */

import { type ReactElement } from "react";

import { Stack } from "@stealthscale/component-layout";
import { Link } from "@stealthscale/component-navigation";
import { Text } from "@stealthscale/component-typography";
import { createLink, RouteLink } from "@stealthscale/provider-router";
import { Matrix, type Scene, specimen, useWords, written } from "@stealthscale/specimen";

/**
 * Route link rendered through the navigation package's `Link`.
 *
 * @remarks
 *   `RouteLink` renders a bare `a`, which the page's reset leaves in the text color, so inside a
 *   sentence it is indistinguishable from the text around it.
 */
const Inlined = createLink(Link);

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
 * Call site the source of each scene is written from.
 */
const SAMPLE = {
  children: "Open the page",
  imports: 'import { RouteLink } from "@stealthscale/provider-router";',
  name: "RouteLink",
};

/**
 * Renders one route link per ID in `ROUTES`.
 */
function Resolving(): ReactElement {
  const { t } = useWords("route-link");

  return (
    <Matrix knob="to" of={ROUTES}>
      {(to) => <RouteLink to={to}>{t("opens")}</RouteLink>}
    </Matrix>
  );
}

/**
 * Renders a route link inside a sentence.
 */
function Inline(): ReactElement {
  const { t } = useWords("route-link");

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
 * Hand-written scene for route IDs resolved through the route map.
 */
export const resolving: Scene = {
  about: "route-link.resolving.about",
  draw: Resolving,
  source: written(SAMPLE, { to: "specimen.components.actions.button" }),
  title: "route-link.resolving.title",
};

/**
 * Hand-written scene for a route link inside a sentence.
 */
export const inline: Scene = {
  about: "route-link.inline.about",
  draw: Inline,
  source: written(SAMPLE, { to: "specimen.components.actions.button" }),
  title: "route-link.inline.title",
};

export default specimen({
  about: "route-link.about",
  id: "foundations/router/link",
  imports: 'import { RouteLink } from "@stealthscale/provider-router";',
  scenes: [resolving, inline],
  title: "route-link.title",
});
