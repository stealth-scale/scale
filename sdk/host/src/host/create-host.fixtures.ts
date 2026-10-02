import { type Mock } from "vitest";

import { type Transport } from "@stealthscale/provider-data";
import { type Product } from "@stealthscale/sdk-core";

import { eagerly, withCode } from "#host/host.fixtures.ts";
import { PRODUCT, timeOff } from "#host/product.fixtures.ts";
import { type Load, loading } from "#host/ready.fixtures.ts";
import { type Deciding, deciding } from "#stores/access.fixtures.ts";
import { type Flagging, flagging } from "#stores/flags.fixtures.ts";
import { ADA, type Switchable, switchable } from "#stores/session.fixtures.ts";

export interface Hanging {
  readonly signals: readonly AbortSignal[];
  readonly transport: Transport;
}

export function hanging(): Hanging {
  const signals: AbortSignal[] = [];

  return {
    signals,
    transport: {
      run: (_operation, _variables, options) => {
        if (options?.signal !== undefined) signals.push(options.signal);

        return new Promise<never>(() => {});
      },
      subscribe: () => Promise.resolve(),
    },
  };
}

export interface EagerLoad {
  readonly load: Mock<Load>;
  readonly product: Product;
}

export function eagerLoad(): EagerLoad {
  const load = loading();

  return {
    load,
    product: withCode(eagerly(PRODUCT, "time-off"), "time-off", {
      ...timeOff.code,
      routes: { overview: load, request: load },
    }),
  };
}

export interface Sources {
  readonly access: Deciding;
  readonly flags: Flagging;
  readonly session: Switchable;
}

export function sourcesOf(): Sources {
  return { access: deciding(), flags: flagging(), session: switchable(ADA) };
}
