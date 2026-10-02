import { act, render, type RenderResult, within } from "@testing-library/react";
import { getI18n } from "react-i18next";

import { type Catalogues, NONE } from "@stealthscale/provider-i18n";
import { type AnyRouter, RouterProvider } from "@stealthscale/provider-router";
import { Shell } from "@stealthscale/provider-shell";
import { defineContract, extension, hostContract, route } from "@stealthscale/sdk-core";
import { memoryStore } from "@stealthscale/settings";

import { type Host } from "#host/options.ts";
import { billingContract, timeOff, timeOffContract } from "#host/product.fixtures.ts";
import { HostProvider } from "#parts/provider.tsx";
import { standaloneOf } from "#standalone.fixtures.ts";
import { type StandaloneSources } from "#standalone.ts";
import { type StandalonePageOptions } from "#standalone/app.tsx";
import { StandaloneContext } from "#standalone/context.ts";
import { type OperationModes } from "#standalone/data.ts";
import { standaloneHosted } from "#standalone/hosted.ts";
import { standaloneRouter } from "#standalone/router.ts";
import { flagsOf } from "#standalone/start.ts";

export const auditContract = defineContract("audit", () => ({
  extensions: {
    aside: extension({ position: "after", target: hostContract.slots.aside }),
    brand: extension({ position: "after", target: hostContract.slots.brand }),
    footer: extension({ position: "after", target: hostContract.slots.footer }),
    header: extension({ position: "after", target: hostContract.slots.header }),
    navigation: extension({ position: "after", target: hostContract.slots.navigation }),
    status: extension({ position: "after", target: hostContract.slots.status }),
    user: extension({ position: "after", target: hostContract.slots.userMenu }),
  },
  version: "1.0.0",
}));

export const lonelyContract = defineContract("lonely", () => ({ version: "1.0.0" }));

export const quietContract = defineContract("shell", () => ({
  routes: { quiet: route({ path: "quiet" }) },
  version: "1.0.0",
}));

export const WORKBENCH = standaloneOf({
  beside: [billingContract, auditContract],
  contract: timeOffContract,
  manifest: timeOff,
});

export const LONELY = standaloneOf({ contract: lonelyContract });

export const QUIET = standaloneOf({ contract: quietContract });

export function cataloguesOf(): Catalogues {
  const { language, store } = getI18n();
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the test instance's store contains the catalogues the i18n layer loaded, by namespace
  const defaults = store.data[language] as Catalogues["defaults"];

  return {
    ...NONE,
    bundled: { [language]: defaults },
    defaults,
    fallback: language,
    languages: [language],
    namespaces: Object.keys(defaults),
  };
}

export interface Opened extends RenderResult {
  readonly host: Host;
  readonly modes: OperationModes;
  readonly router: AnyRouter;
  readonly sources: StandaloneSources;
}

export async function settled(change: () => void): Promise<void> {
  await act(async () => {
    change();
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 20);
    });
  });
}

export async function opened(
  options: Partial<StandalonePageOptions> = {},
  at = "/",
): Promise<Opened> {
  window.history.replaceState(null, "", at);

  const { glyphs = {}, locales, product = WORKBENCH, themes } = options;
  const store = memoryStore();
  const { host, modes, sources } = standaloneHosted(product, glyphs, store);
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

  const view = await act(async () => {
    const rendered = render(
      <StandaloneContext value={state}>
        <Shell
          app={product.productId}
          catalogues={cataloguesOf()}
          locales={locales}
          store={store}
          themes={themes}
        >
          <HostProvider host={host} router={router}>
            <RouterProvider router={router} />
          </HostProvider>
        </Shell>
      </StandaloneContext>,
    );

    await new Promise<void>((resolve) => {
      setTimeout(resolve, 20);
    });

    return rendered;
  });

  await within(view.container).findByRole("dialog", { name: "Development panel" });

  return { ...view, host, modes, router, sources };
}

export function panelOf({ container }: Opened): HTMLElement {
  return within(container).getByRole("dialog", { name: "Development panel" });
}
