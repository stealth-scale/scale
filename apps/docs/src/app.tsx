/**
 * Renders the catalogue application: the shell providers and the router.
 */

import { type ReactElement, useEffect, useState } from "react";

import { catalogues } from "virtual:i18n";

import { RouterProvider } from "@stealthscale/provider-router";
import { Shell } from "@stealthscale/provider-shell";

import { rerouted, routed } from "#routes.tsx";
import { THEMES } from "#themes.ts";

/**
 * The application name the user's settings are stored under, so another application on this
 * origin stores its own.
 */
const APP = "docs";

/**
 * The locales the catalogue offers. The first is the one every key is defined in.
 *
 * @remarks
 *   Every catalogue is in English, and a locale without a catalogue of its own falls back to it.
 *   The other locales change the text direction (right to left for Arabic) and how numbers, dates
 *   and lists are formatted.
 */
const LOCALES: readonly [string, ...string[]] = [
  "en",
  "nl",
  "de",
  "fr",
  "es",
  "it",
  "ar",
  "zh-CN",
  "ja-JP",
];

/**
 * Renders the router inside the shell, which provides the colour mode, theme, locale, viewport and
 * shortcuts.
 *
 * @remarks
 *   `Shell` nests the seven providers in the order they need. The theme and colour-mode switchers
 *   in the chrome read those providers directly.
 *   The router is created once, when the tree mounts, and kept for its life. It is state rather
 *   than a module constant, because a hot update runs the module again, and a second router on a
 *   second history left the provider waiting and the page blank. Fast Refresh runs the effect again
 *   on a hot update, whatever its dependencies, so `rerouted` gives the same router the new route
 *   tree when the page index has changed.
 */
export function App(): ReactElement {
  const [router] = useState(routed);

  useEffect(() => {
    rerouted(router);
  }, [router]);

  return (
    <Shell app={APP} catalogues={catalogues} locales={LOCALES} themes={THEMES}>
      <RouterProvider router={router} />
    </Shell>
  );
}
