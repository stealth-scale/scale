import { installed } from "@stealthscale/sdk-core";

import { billing, payroll, productOf, timeOff } from "#host/product.fixtures.ts";

export const SWITCHED = productOf([
  installed(timeOff, { locked: true }),
  installed(billing, { enabled: false }),
  installed(payroll),
]);

export function keyOf(subject: string, pluginId: string): string {
  return `stealth.people.${subject}.plugin.${pluginId}`;
}

export function ignored(): void {}
