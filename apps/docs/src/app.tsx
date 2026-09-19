/**
 * Puts everything the catalogue reads in scope, and routes the pages under them.
 */

import { type ReactElement } from "react";

import { catalogues } from "virtual:i18n";

import { RouterProvider } from "@stealthscale/provider-router";
import { Shell } from "@stealthscale/provider-shell";

import { routed } from "#routes.tsx";
import { THEMES } from "#themes.ts";

/**
 * The application every setting a reader makes is remembered under, so another application on this
 * origin keeps its own.
 */
const APP = "docs";

/**
 * The locales the catalogue offers, the first being the one every key is defined in.
 */
const LOCALES: readonly [string, ...string[]] = ["en"];

/**
 * The router over the pages this build indexed, built once for the life of the page.
 */
const ROUTER = routed();

/**
 * Draws the catalogue with the colour mode, theme, locale, viewport and shortcuts in scope.
 *
 * @remarks
 *   One provider rather than seven, because the order they nest in is knowledge the shell already
 *   holds. The chrome reads all of it: the theme switcher moves `Themed` and the colour-mode
 *   switcher moves `ColorModeProvider`, neither of which this file states again.
 */
export function App(): ReactElement {
  return (
    <Shell app={APP} catalogues={catalogues} locales={LOCALES} themes={THEMES}>
      <RouterProvider router={ROUTER} />
    </Shell>
  );
}
