import { definePlugin, defineProduct, installed } from "@stealthscale/sdk-core";

import { BoardPage, Note, Pin, Tag } from "#desk-parts.fixtures.tsx";
import { deskContract, memoContract } from "#desk.fixtures.ts";
import { lazy } from "#notes.fixtures.ts";
import { shop } from "#shop-manifest.fixtures.ts";

export const desk = definePlugin(deskContract, {
  extensions: { note: { component: lazy({ Note }) }, pin: { component: lazy({ Pin }) } },
  routes: { board: lazy({ BoardPage }) },
});

export const memo = definePlugin(memoContract, {
  extensions: { tag: { component: lazy({ Tag }) } },
});

export const OFFICE = defineProduct({
  name: "product.name",
  plugins: [installed(desk)],
  productId: "office",
  version: "1.0.0",
});

export const MEMO_OFF = defineProduct({
  ...OFFICE,
  plugins: [installed(desk), installed(memo, { enabled: false })],
});

export const STORE = defineProduct({
  name: "product.name",
  plugins: [installed(shop)],
  productId: "store",
  version: "1.0.0",
});
