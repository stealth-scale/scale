import {
  defineContract,
  definePlugin,
  extension,
  installed,
  type Product,
} from "@stealthscale/sdk-core";

import { lazy, PACKAGES, productOf, timeOff, timeOffContract } from "#host/product.fixtures.ts";
import { Chip, Cover, Glow, Halo, Hint, Notice, Ring } from "#slots/parts.fixtures.tsx";

export const pagesContract = defineContract("pages", () => ({
  extensions: {
    chip: extension({
      position: "after",
      target: timeOffContract.routes.overview,
      when: { route: timeOffContract.routes.request },
    }),
    cover: extension({ position: "replace", target: timeOffContract.routes.request }),
    glow: extension({ position: "wrap", target: { every: "route" } }),
    halo: extension({ position: "wrap", target: { every: "route" } }),
    hint: extension({
      position: "after",
      target: timeOffContract.routes.overview,
      when: { authenticated: false },
    }),
    notice: extension({ position: "before", target: timeOffContract.routes.overview }),
    ring: extension({ position: "wrap", target: timeOffContract.routes.overview }),
  },
  version: "1.0.0",
}));

export const pages = definePlugin(pagesContract, {
  extensions: {
    chip: { component: lazy({ Chip }) },
    cover: { component: lazy({ Cover }) },
    glow: { component: lazy({ Glow }) },
    halo: { component: lazy({ Halo }) },
    hint: { component: lazy({ Hint }) },
    notice: { component: lazy({ Notice }) },
    ring: { component: lazy({ Ring }) },
  },
});

export const PAGED: Product = productOf(
  [installed(timeOff, { config: { approvers: 3, region: "eu" } }), installed(pages)],
  { ...PACKAGES, pages: { directory: "/plugins/pages", name: "@acme/plugin-pages" } },
);
