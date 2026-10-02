import { defineContract } from "#define.ts";
import { lazy, overview } from "#manifest.fixtures.ts";
import { definePlugin } from "#manifest.ts";
import { route } from "#route.ts";
import { needs } from "#version.ts";

export const identityContract = defineContract("identity", {
  routes: { signIn: route({ path: "sign-in" }) },
  version: "0.4.2",
});

export const identity = definePlugin(identityContract, {
  routes: { signIn: lazy({ overview }) },
});

export const teams = definePlugin(
  defineContract("teams", { requires: [needs(identityContract, "^0.4.0")], version: "1.0.0" }),
  {},
);

export const audit = definePlugin(
  defineContract("audit", { requires: [needs(identityContract, "^0.3.0", { optional: true })] }),
  {},
);

export const stale = definePlugin(
  defineContract("stale", { requires: [needs(identityContract, "^0.3.0")] }),
  {},
);

export const unversioned = definePlugin(defineContract("unversioned", {}), {});

export const lenient = definePlugin(
  defineContract("lenient", { requires: [{ pluginId: "unversioned", range: "^1.0.0" }] }),
  {},
);

export const alpha = definePlugin(
  defineContract("alpha", { requires: [{ pluginId: "beta", range: "^1.0.0" }], version: "1.0.0" }),
  {},
);

export const beta = definePlugin(
  defineContract("beta", {
    requires: [
      { pluginId: "alpha", range: "^1.0.0" },
      { optional: true, pluginId: "gamma", range: "^1.0.0" },
    ],
    version: "1.0.0",
  }),
  {},
);
