import { definePlugin, type PluginManifest } from "@stealthscale/sdk-core";

import { lazy } from "#notes.fixtures.ts";
import { Badge } from "#probes.fixtures.tsx";
import {
  Banner,
  BlindPage,
  Broken,
  CartFallback,
  CartPage,
  CrashPage,
  HiddenPage,
  Linked,
  Notice,
  StockPage,
  Wrapper,
} from "#shop-parts.fixtures.tsx";
import { shopContract } from "#shop.fixtures.ts";

export function checkout(): string {
  return "checked out";
}

export function decline(): Promise<never> {
  return Promise.reject(new Error("declined"));
}

export function refund({ orderId }: { readonly orderId: string }): string {
  return `refunded ${orderId}`;
}

export const shop = definePlugin(shopContract, {
  commands: {
    checkout: { run: lazy({ checkout }) },
    decline: { run: lazy({ decline }) },
    refund: { run: lazy({ refund }) },
  },
  extensions: {
    badge: { component: lazy({ Badge }) },
    banner: { component: lazy({ Banner }), fallback: lazy({ Banner }) },
    broken: { component: lazy({ Broken }) },
    linked: { component: lazy({ Linked }) },
    wrapper: { component: lazy({ Wrapper }) },
  },
  routes: {
    blind: lazy({ BlindPage }),
    cart: { component: lazy({ CartPage }), fallback: lazy({ CartFallback }) },
    crash: lazy({ CrashPage }),
    hidden: lazy({ HiddenPage }),
    stock: lazy({ StockPage }),
  },
  settings: { notice: { component: lazy({ Notice }) } },
});

export const SHOP = { beside: [], contract: shopContract, manifest: shop };

export const EMPTY: PluginManifest = { ...shop, code: { ...shop.code, extensions: {} } };
