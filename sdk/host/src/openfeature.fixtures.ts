import {
  type InMemoryFlagConfiguration,
  OpenFeature,
  TypedInMemoryProvider,
} from "@openfeature/web-sdk";
import { type Mock, vi } from "vitest";

export const CALENDAR = "time-off/calendar";

export const LAYOUT = "time-off/layout";

export const PAUSED = "time-off/paused";

export const TARGETED = "time-off/targeted";

export function configOf(calendar: boolean): InMemoryFlagConfiguration {
  return {
    [CALENDAR]: {
      defaultVariant: calendar ? "on" : "off",
      disabled: false,
      variants: { off: false, on: true },
    },
    [LAYOUT]: {
      defaultVariant: "board",
      disabled: false,
      variants: { board: "board", list: "list" },
    },
    [PAUSED]: { defaultVariant: "on", disabled: true, variants: { off: false, on: true } },
    [TARGETED]: {
      contextEvaluator: (context) => (context.targetingKey === "ada" ? "on" : "off"),
      defaultVariant: "off",
      disabled: false,
      variants: { off: false, on: true },
    },
  };
}

export async function bound(domain: string): Promise<TypedInMemoryProvider> {
  const provider = new TypedInMemoryProvider(configOf(true));

  await OpenFeature.setProviderAndWait(domain, provider);

  return provider;
}

export function listening(): Mock<() => void> {
  return vi.fn<() => void>();
}
