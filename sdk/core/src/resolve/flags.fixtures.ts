import { defineContract } from "#define.ts";
import { flag } from "#flag.ts";
import { manifestOf } from "#resolve/resolve.fixtures.ts";

export const switches = manifestOf(
  defineContract("switches", {
    featureFlags: {
      layout: flag({
        default: "list",
        description: "flags.layout",
        expires: "2099-01-01",
        kind: "experiment",
        variants: ["list", "board"],
      }),
      sync: flag({ default: true, description: "flags.sync", kind: "ops" }),
    },
  }),
);

export const faulty = manifestOf(
  defineContract("faulty", {
    featureFlags: {
      lone: {
        default: "a",
        description: "flags.lone",
        expires: "2099-01-01",
        flagKind: "experiment",
        kind: "featureFlag",
        type: "string",
        variants: ["a"],
      },
      off: {
        default: "c",
        description: "flags.off",
        expires: "2099-01-01",
        flagKind: "experiment",
        kind: "featureFlag",
        type: "string",
        variants: ["a", "b"],
      },
      open: {
        default: "a",
        description: "flags.open",
        flagKind: "experiment",
        kind: "featureFlag",
        type: "string",
        variants: ["a", "b"],
      },
      past: {
        default: false,
        description: "flags.past",
        expires: "2026-01-01",
        flagKind: "release",
        kind: "featureFlag",
        type: "boolean",
      },
      typed: {
        default: false,
        description: "flags.typed",
        expires: "2099-01-01",
        flagKind: "release",
        kind: "featureFlag",
        type: "string",
      },
      undated: {
        default: false,
        description: "flags.undated",
        flagKind: "release",
        kind: "featureFlag",
        type: "boolean",
      },
    },
  }),
);
