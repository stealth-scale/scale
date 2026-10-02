import { pluginOf, type ResolvedExtension, type ResolvedSlot } from "@stealthscale/sdk-core";

import { type Judge } from "#slots/contents.ts";

export const ASIDE = "host/aside";

export function extensionOf(id: string, given: Partial<ResolvedExtension> = {}): ResolvedExtension {
  return {
    disabled: false,
    fallback: false,
    id,
    plugin: pluginOf(id),
    position: "after",
    target: `slot:${ASIDE}`,
    ...given,
  };
}

export function slotOf(
  extensions: readonly string[],
  given: Partial<ResolvedSlot> = {},
): ResolvedSlot {
  return { extensions, id: ASIDE, plugin: "host", region: true, ...given };
}

export const TOTAL = extensionOf("billing/total");

export const BALANCE = extensionOf("time-off/balance");

export const EXTENSIONS = [
  TOTAL,
  extensionOf("time-off/balance", { required: true }),
  extensionOf("time-off/calendar", { target: "slot:host/footer" }),
  extensionOf("time-off/notes", { disabled: true, target: "slot:host/footer" }),
  extensionOf("time-off/tips", { order: 1, target: "slot:host/footer" }),
  extensionOf("time-off/digest", { target: "slot:host/footer" }),
];

export const PASSING: Judge = {
  isMet: () => true,
  isOn: () => true,
  isQuarantined: () => false,
};

export const WITHOUT_PAYROLL: Judge = { ...PASSING, isOn: (pluginId) => pluginId !== "payroll" };

export const BADGE = extensionOf("time-off/badge", { target: "extension:billing/total" });

export const PAYROLL_BADGE = extensionOf("payroll/badge", { target: "extension:billing/total" });

export const ATTACHED = [
  TOTAL,
  BADGE,
  PAYROLL_BADGE,
  extensionOf("time-off/hint", { disabled: true, target: "extension:billing/total" }),
];

export function idsOf(extensions: readonly ResolvedExtension[]): readonly string[] {
  return extensions.map(({ id }) => id);
}
