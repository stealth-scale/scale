/**
 * Puts everything the catalogue reads in scope, and routes the pages under them.
 */

import { type ReactElement, useState } from "react";

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
 * Draws the catalogue with the colour mode, theme, locale, viewport and shortcuts in scope.
 *
 * @remarks
 *   One provider rather than seven, because the order they nest in is knowledge the shell already
 *   holds. The chrome reads all of it: the theme switcher moves `Themed` and the colour-mode
 *   switcher moves `ColorModeProvider`, neither of which this file states again.
 *   The router is made once, when the tree mounts, and kept for its life. Held as state rather
 *   than as a module constant, because a hot update in development runs the module again, and a
 *   second router on a second history is one the provider waits on for ever, which reads as a
 *   blank page. A page the index gains while the server runs is reached after a reload.
 */
export function App(): ReactElement {
  const [router] = useState(routed);

  return (
    <Shell app={APP} catalogues={catalogues} locales={LOCALES} themes={THEMES}>
      <RouterProvider router={router} />
    </Shell>
  );
}
