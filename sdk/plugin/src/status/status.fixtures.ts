import { installed, type Product } from "@stealthscale/sdk-core";

import { billing, PRODUCT, productOf, timeOff } from "#host/product.fixtures.ts";
import { type HostReport, type RenderTarget } from "#host/report.ts";
import { type Quarantined } from "#host/stores.ts";

export const LOCKED: Product = productOf([
  installed(timeOff, { config: { approvers: 3, region: "eu" } }),
  installed(billing, { locked: true }),
]);

export const WARNED: Product = {
  ...PRODUCT,
  warnings: [{ path: "billing.version", reason: "is above the range the product was built with" }],
};

export const BROKEN_TOTAL: Quarantined = { error: "broken", target: "extension:billing/total" };

export const QUARANTINE = new Map<RenderTarget, Quarantined>([
  ["extension:billing/total", BROKEN_TOTAL],
  ["route:time-off/overview", { error: "broken", target: "route:time-off/overview" }],
]);

export const FULL: HostReport = { kind: "slot-full", slot: "feed/badge", target: "notes/second" };
