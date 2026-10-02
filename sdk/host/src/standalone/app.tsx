/**
 * Starts the standalone page of a plugin: the plugin under a real host, the plugins beside it from
 * their contracts alone, and the development panel over the page.
 *
 * @remarks
 *   The standalone layer of `vite-config-product` serves a page whose entry calls
 *   `renderStandalone` with `virtual:product` and `virtual:i18n`. The module renders React, so it
 *   is an entry of its own, apart from `./standalone`, which the build evaluates in Node.
 */

import { createRoot, type Root } from "react-dom/client";

import { type Catalogues } from "@stealthscale/provider-i18n";
import { RouterProvider } from "@stealthscale/provider-router";
import { Shell } from "@stealthscale/provider-shell";
import { type Product } from "@stealthscale/sdk-core";

import { HostProvider } from "#parts/provider.tsx";
import { StandaloneContext, type StandaloneGlyphs } from "#standalone/context.ts";
import { standaloneHosted } from "#standalone/hosted.ts";
import { standaloneRouter } from "#standalone/router.ts";
import { flagsOf } from "#standalone/start.ts";

/**
 * Lists what the standalone page renders with.
 */
export interface StandalonePageOptions {
  /**
   * The catalogues, from `virtual:i18n`. Every key renders as itself where left out.
   */
  readonly catalogues?: Catalogues | undefined;

  /**
   * The element the page renders into. The element with the id `root` where left out.
   */
  readonly element?: Element | null | undefined;

  /**
   * The glyphs of the settings forms and of the panel's stage triggers. None where left out.
   */
  readonly glyphs?: StandaloneGlyphs | undefined;

  /**
   * The locales the page offers, the first its fallback. American English alone where left out.
   */
  readonly locales?: readonly [string, ...string[]] | undefined;

  /**
   * The standalone product, from `virtual:product`.
   */
  readonly product: Product;

  /**
   * The themes the page offers. The page renders the first until a person picks another. The
   * application's one theme where left out.
   */
  readonly themes?: readonly string[] | undefined;
}

/**
 * Renders the standalone page once the host is ready.
 *
 * @param options - The product, the catalogues, the glyphs, the locales, the themes and the
 *   element.
 * @returns The React root the page renders in, which `unmount` takes down.
 * @throws {@link Error} Where no element is given and the document has none with the id `root`.
 */
export async function renderStandalone({
  catalogues,
  element = document.querySelector("#root"),
  glyphs = {},
  locales,
  product,
  themes,
}: StandalonePageOptions): Promise<Root> {
  if (element === null) {
    throw new Error(
      "The standalone page renders into the element with the id root, and the document has none.",
    );
  }

  const { host, modes, sources } = standaloneHosted(product, glyphs);
  const { router, routes } = standaloneRouter(host, product);
  const state = {
    access: sources.access,
    flags: flagsOf(product),
    glyphs,
    modes,
    routes,
    session: sources.session,
  };

  await host.ready();

  const root = createRoot(element);

  root.render(
    <StandaloneContext value={state}>
      <Shell app={product.productId} catalogues={catalogues} locales={locales} themes={themes}>
        <HostProvider host={host} router={router}>
          <RouterProvider router={router} />
        </HostProvider>
      </Shell>
    </StandaloneContext>,
  );

  return root;
}
