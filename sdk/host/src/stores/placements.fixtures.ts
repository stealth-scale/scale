import { type SessionState, type Store } from "@stealthscale/sdk-plugin";

import { PRODUCT } from "#host/product.fixtures.ts";
import { type Switchable } from "#stores/session.fixtures.ts";
import { createSessionStore } from "#stores/session.ts";
import { ignored } from "#stores/switches.fixtures.ts";

export const ADA_KEY = "stealth.people.ada@acme.placements";

export const GRACE_KEY = "stealth.people.grace@acme.placements";

export function storedOf(slots: unknown, version: unknown = 1): string {
  return JSON.stringify({ slots, version });
}

export function parsedOf(text: null | string): unknown {
  return text === null ? null : JSON.parse(text);
}

export function sessionOf(source: Switchable): Store<SessionState> {
  return createSessionStore({ product: PRODUCT, report: ignored, source });
}
