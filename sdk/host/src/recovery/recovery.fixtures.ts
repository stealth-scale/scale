import { type MockInstance, vi } from "vitest";

import {
  installed,
  type Migration,
  type PluginCode,
  type Product,
  type RouteCode,
  type RouteEntry,
} from "@stealthscale/sdk-core";

import { withCode } from "#host/host.fixtures.ts";
import { billing, payroll, productOf, timeOff } from "#host/product.fixtures.ts";
import { type Load } from "#host/ready.fixtures.ts";
import { instrumented } from "#recovery/instrument.ts";

export type Importer = () => Promise<unknown>;

export interface Picked {
  readonly kind: string;
  readonly pick: (code: PluginCode) => Importer | undefined;
}

export const VERSION = "2026.10.1";

export const MIGRATIONS: Readonly<Record<number, Migration>> = { 1: (values) => values };

export function reloads(): MockInstance<() => void> {
  return vi.spyOn(window.location, "reload").mockImplementation(() => {});
}

export function productWith(productId: string, code: PluginCode): Product {
  const product = productOf([installed(timeOff), installed(billing), installed(payroll)], {
    productId,
    version: VERSION,
  });

  return withCode(product, "time-off", code);
}

export function reloadedBefore(productId: string): void {
  sessionStorage.setItem(`stealth.${productId}.reloaded`, VERSION);
}

export function codeIn(product: Product): PluginCode {
  const manifest = instrumented(product).product.manifests["time-off"];

  if (manifest === undefined) throw new Error("The fixture product installs no time-off plugin.");

  return manifest.code;
}

function entryOf(route: RouteCode | undefined): RouteEntry | undefined {
  return typeof route === "function" ? { component: route } : route;
}

export function pageOf(code: PluginCode, name: string): Importer {
  const component = entryOf(code.routes?.[name])?.component;

  if (component === undefined) throw new Error(`The fixture code maps no page ${name}.`);

  return component;
}

export function nothing(): Load {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- Vite's preload helper resolves a cancelled import with no module, which an importer's type does not state
  return vi.fn(() => Promise.resolve()) as unknown as Load;
}

export const IMPORTERS: readonly Picked[] = [
  { kind: "a command", pick: (code) => code.commands?.["approve"]?.run },
  { kind: "an extension", pick: (code) => code.extensions?.["total"]?.component },
  { kind: "an extension's fallback", pick: (code) => code.extensions?.["total"]?.fallback },
  { kind: "a page", pick: (code) => pageOf(code, "request") },
  { kind: "a page with a fallback", pick: (code) => pageOf(code, "overview") },
  { kind: "a page's fallback", pick: (code) => entryOf(code.routes?.["overview"])?.fallback },
  { kind: "a settings section", pick: (code) => code.settings?.["reminders"]?.component },
];
