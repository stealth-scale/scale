import {
  type FlagSource,
  installed,
  type ResolvedFlag,
  type Session,
  setFlag,
} from "@stealthscale/sdk-core";
import { type FlagReading } from "@stealthscale/sdk-plugin";

import { billing, payroll, productOf, timeOff, timeOffContract } from "#host/product.fixtures.ts";
import { type OverrideStorage } from "#stores/flags.ts";

export const CALENDAR = "time-off/calendar";

export const LAYOUT = "time-off/layout";

export const SYNC = "billing/sync";

export const KEY = "stealth.people.flag-overrides";

export const SERVED: FlagReading = { origin: "source", value: true };

export const FLAGGED = productOf([installed(timeOff), installed(billing), installed(payroll)], {
  featureFlags: [
    setFlag(timeOffContract.featureFlags.calendar, true),
    setFlag(timeOffContract.featureFlags.layout, "board"),
  ],
});

export const MISSTATED: readonly ResolvedFlag[] = [
  {
    default: false,
    description: "flags.calendar",
    id: CALENDAR,
    kind: "release",
    plugin: "time-off",
    product: "on",
    type: "boolean",
  },
  {
    default: "list",
    description: "flags.layout",
    expires: "2026-12-31",
    id: LAYOUT,
    kind: "experiment",
    plugin: "time-off",
    type: "string",
  },
];

export function flagIn(id: string): ResolvedFlag {
  const flag = FLAGGED.flags.find((declared) => declared.id === id);

  if (flag === undefined) throw new Error(`The fixture product declares no flag ${id}.`);

  return flag;
}

type Stated = boolean | Error | string;

interface Pending {
  readonly reject: (error: Error) => void;
  readonly resolve: () => void;
}

export interface Flagging {
  readonly change: (id: string, value: Stated) => void;
  readonly evaluated: () => readonly string[];
  readonly fail: (error: Error) => void;
  readonly finish: () => void;
  readonly identified: () => readonly Session[];
  readonly listeners: () => number;
  readonly source: FlagSource;
}

export function flagging(
  initial: Readonly<Record<string, Stated>> = {},
  identifies = true,
): Flagging {
  const values = new Map<string, Stated>(Object.entries(initial));
  const evaluated: string[] = [];
  const identified: Session[] = [];
  const pending: Pending[] = [];
  const listeners = new Set<() => void>();
  const source: FlagSource = {
    evaluate: ({ id }) => {
      const value = values.get(id);

      evaluated.push(id);

      if (value instanceof Error) throw value;

      return value;
    },
    identify: identifies
      ? (session) => {
          identified.push(session);

          return new Promise<void>((resolve, reject) => {
            pending.push({ reject, resolve });
          });
        }
      : undefined,
    subscribe: (listener) => {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
  };

  return {
    change: (id, value) => {
      values.set(id, value);

      for (const listener of listeners) listener();
    },
    evaluated: () => evaluated,
    fail: (error) => {
      pending.shift()?.reject(error);
    },
    finish: () => {
      pending.shift()?.resolve();
    },
    identified: () => identified,
    listeners: () => listeners.size,
    source,
  };
}

export interface Tab {
  readonly storage: OverrideStorage;
  readonly text: () => null | string;
}

export function tab(stored?: string, refuses = false): Tab {
  const entries = new Map<string, string>(stored === undefined ? [] : [[KEY, stored]]);

  const refuse = (): void => {
    if (refuses) throw new Error("The storage refused the write.");
  };

  return {
    storage: {
      getItem: (key) => entries.get(key) ?? null,
      removeItem: (key) => {
        refuse();
        entries.delete(key);
      },
      setItem: (key, value) => {
        refuse();
        entries.set(key, value);
      },
    },
    text: () => entries.get(KEY) ?? null,
  };
}
