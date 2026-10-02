import { type AccessCheck, type AccessSource } from "@stealthscale/sdk-core";

export const SEVEN: AccessCheck = {
  permission: "time-off/request.approve",
  resource: { id: "7", type: "time-off/request" },
};

export const EIGHT: AccessCheck = {
  permission: "time-off/request.approve",
  resource: { id: "8", type: "time-off/request" },
};

export const ELSEWHERE: AccessCheck = {
  permission: "elsewhere/record.edit",
  resource: { id: "7", type: "elsewhere/record" },
};

interface Pending {
  readonly reject: (error: unknown) => void;
  readonly resolve: (decisions: readonly boolean[]) => void;
}

export interface Deciding {
  readonly batches: AccessCheck[][];
  readonly listeners: () => number;
  readonly notify: () => void;
  readonly reject: (error: unknown) => void;
  readonly resolve: (decisions: readonly boolean[]) => void;
  readonly source: AccessSource;
}

export function deciding(): Deciding {
  const batches: AccessCheck[][] = [];
  const pending: Pending[] = [];
  const listeners = new Set<() => void>();

  return {
    batches,
    listeners: () => listeners.size,
    notify: () => {
      for (const listener of listeners) listener();
    },
    reject: (error) => {
      pending.shift()?.reject(error);
    },
    resolve: (decisions) => {
      pending.shift()?.resolve(decisions);
    },
    source: {
      check: (checks) => {
        batches.push([...checks]);

        return new Promise<readonly boolean[]>((resolve, reject) => {
          pending.push({ reject, resolve });
        });
      },
      subscribe: (listener) => {
        listeners.add(listener);

        return () => {
          listeners.delete(listener);
        };
      },
    },
  };
}

export async function settled(): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}
