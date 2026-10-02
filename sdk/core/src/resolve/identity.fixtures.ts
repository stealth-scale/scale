import { assemble } from "#assemble.ts";
import { definePlugin } from "#manifest.ts";
import { plain, plainContract } from "#product.fixtures.ts";
import { slot } from "#slot.ts";

export const hosting = definePlugin(assemble("host", {}), {});

export const claiming = definePlugin(
  assemble("host", { slots: { aside: slot({ arity: "one" }) } }),
  {},
);

export const misnamed = { ...plain, contract: { ...plainContract, pluginId: "Plain" } };

export const future = { ...plain, apiVersion: "^9.0.0" } as const;
