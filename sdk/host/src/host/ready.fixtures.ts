import { type Mock, vi } from "vitest";

import { type PluginCode, type Product } from "@stealthscale/sdk-core";

import { eagerly, withCode } from "#host/host.fixtures.ts";
import { PRODUCT } from "#host/product.fixtures.ts";

export type Load = () => Promise<Readonly<Record<string, never>>>;

export function loading(): Mock<Load> {
  return vi.fn<Load>(() => Promise.resolve({}));
}

export function failing(): Mock<Load> {
  return vi.fn<Load>(() => Promise.reject(new Error("The chunk is gone.")));
}

export function everyKind(load: Load): PluginCode {
  return {
    commands: { approve: { run: load } },
    extensions: { total: { component: load, fallback: load } },
    routes: { overview: { component: load, fallback: load }, request: load },
    settings: { quiet: {}, reminders: { component: load } },
  };
}

export function eagerTimeOff(load: Load): Product {
  return withCode(eagerly(PRODUCT, "time-off"), "time-off", everyKind(load));
}

export function lazyTimeOff(load: Load): Product {
  return withCode(PRODUCT, "time-off", everyKind(load));
}

export interface Gate {
  readonly open: () => void;
  readonly promise: Promise<void>;
}

export function gate(): Gate {
  const opened: Array<() => void> = [];
  const promise = new Promise<void>((resolve) => {
    opened.push(resolve);
  });

  return {
    open: () => {
      for (const resolve of opened) resolve();
    },
    promise,
  };
}
