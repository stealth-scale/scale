import { type Session, type SessionSource } from "@stealthscale/sdk-core";

export const ADA: Session = {
  authenticated: true,
  displayName: "Ada",
  entitlements: ["time-off/module", "elsewhere/module"],
  permissions: ["time-off/request.approve", "time-off/request.read", "elsewhere/read"],
  roles: ["time-off/approver"],
  tenantId: "acme",
  userId: "ada",
};

export const GRACE: Session = {
  authenticated: true,
  entitlements: [],
  permissions: ["billing/invoice.read"],
  roles: [],
  tenantId: "acme",
  userId: "grace",
};

export interface Switchable extends SessionSource {
  readonly change: (session: Session) => void;
  readonly fail: (error: Error) => void;
  readonly listeners: () => number;
  readonly replace: (session: Session) => void;
}

export function switchable(initial: Session): Switchable {
  let current: Session = initial;
  let failure: Error | undefined;
  const listeners = new Set<() => void>();

  return {
    change: (session) => {
      current = session;
      failure = undefined;

      for (const listener of listeners) listener();
    },
    fail: (error) => {
      failure = error;

      for (const listener of listeners) listener();
    },
    listeners: () => listeners.size,
    read: () => {
      if (failure !== undefined) throw failure;

      return current;
    },
    replace: (session) => {
      current = session;
    },
    subscribe: (listener) => {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
  };
}
