import { act, fireEvent } from "@testing-library/react";
import { getI18n } from "react-i18next";
import { type Mock, vi } from "vitest";

import {
  command,
  defineContract,
  definePlugin,
  installed,
  type Product,
  type Toaster,
} from "@stealthscale/sdk-core";
import { type CommandStatus, type HostRuntime } from "@stealthscale/sdk-plugin";

import { PaletteRoot } from "#commands/roots.fixtures.tsx";
import { withCode } from "#host/host.fixtures.ts";
import {
  billing,
  lazy,
  page,
  payroll,
  picked,
  PRODUCT,
  productOf,
  run,
  timeOff,
} from "#host/product.fixtures.ts";
import { type Routed, routed } from "#routes/routed.fixtures.tsx";

export type Run = () => Promise<void> | void;

export const REQUEST_KEYS = { code: "KeyR", ctrlKey: true, key: "R", shiftKey: true };

export const PALETTE_KEYS = { code: "KeyK", ctrlKey: true, key: "k" };

export const ESCAPE_KEY = { code: "Escape", key: "Escape" };

export const auditContract = defineContract("audit", () => ({
  commands: {
    archive: command({ label: "commands.archive" }),
    export: command({
      keys: "Mod+Shift+R",
      label: "commands.export",
      when: { authenticated: false },
    }),
  },
  version: "1.0.0",
}));

export function runningOf(product: Product, requested: Mock<Run>): Product {
  return withCode(product, "time-off", {
    commands: {
      approve: { run: lazy({ run }) },
      pick: { run: lazy({ picked }) },
      request: { run: lazy({ requested }) },
    },
    routes: { overview: lazy({ page }), request: lazy({ page }) },
  });
}

export interface Chord {
  readonly exported: Mock<Run>;
  readonly product: Product;
  readonly requested: Mock<Run>;
}

export function chordOf(enabled = true): Chord {
  const exported = vi.fn<Run>();
  const requested = vi.fn<Run>();
  const audit = definePlugin(auditContract, {
    commands: { archive: { run: lazy({ run }) }, export: { run: lazy({ exported }) } },
  });
  const product = productOf([
    installed(audit),
    installed(timeOff, { enabled }),
    installed(billing),
    installed(payroll),
  ]);

  return { exported, product: runningOf(product, requested), requested };
}

export const spelledContract = defineContract("audit", () => ({
  commands: { export: command({ keys: "Shift+Mod+R", label: "commands.export" }) },
  version: "1.0.0",
}));

export function spelledOf(): Chord {
  const exported = vi.fn<Run>();
  const requested = vi.fn<Run>();
  const audit = definePlugin(spelledContract, {
    commands: { export: { run: lazy({ exported }) } },
  });
  const product = productOf([
    installed(audit),
    installed(timeOff),
    installed(billing),
    installed(payroll),
  ]);

  return { exported, product: runningOf(product, requested), requested };
}

export function requesting(requested: Mock<Run>): Product {
  return runningOf(PRODUCT, requested);
}

export function refusing(): Mock<Run> {
  return vi.fn<Run>(() => Promise.reject(new Error("refused")));
}

const WORDS = {
  audit: {
    commands: { archive: "Archive the audit log", export: "Export the audit log" },
    plugin: { name: "Audit" },
  },
  billing: { navigation: { invoices: "Invoices" }, plugin: { name: "Billing" } },
  payroll: {
    commands: { summarize: "Summarize payroll" },
    navigation: { runs: "Payroll runs" },
    plugin: { name: "Payroll" },
  },
  "time-off": {
    commands: { approve: "Approve request", pick: "Pick a person", request: "Request time off" },
    keywords: { commands: { request: "leave holiday" } },
    navigation: { overview: "Time off" },
    plugin: { name: "Time off" },
  },
};

export function worded(): void {
  const i18n = getI18n();

  for (const [namespace, words] of Object.entries(WORDS)) {
    i18n.addResourceBundle("en", namespace, words, true, true);
  }
}

export async function pressedKeys(init: KeyboardEventInit): Promise<void> {
  await act(async () => {
    fireEvent.keyDown(document, init);
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 20);
    });
  });
}

export async function settledTasks(): Promise<void> {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 0);
  });
}

export async function chosen(option: HTMLElement): Promise<void> {
  await act(async () => {
    fireEvent.click(option);
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 20);
    });
  });
}

export async function typedInto(field: HTMLElement, text: string): Promise<void> {
  await act(async () => {
    fireEvent.change(field, { target: { value: text } });
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 20);
    });
  });
}

export async function openedPalette(product: Product = PRODUCT): Promise<Routed> {
  worded();

  const view = await routed({ at: "/invoices", host: { product }, root: PaletteRoot });

  await pressedKeys(PALETTE_KEYS);

  return view;
}

export interface FakeRuntime extends Pick<HostRuntime, "report" | "toaster"> {
  readonly report: Mock<HostRuntime["report"]>;
}

export function fakeRuntime(): FakeRuntime {
  return {
    report: vi.fn<HostRuntime["report"]>(),
    toaster: { create: vi.fn<Toaster["create"]>(() => "1"), dismiss: vi.fn<Toaster["dismiss"]>() },
  };
}

export function statusOf(running: CommandStatus["run"]): CommandStatus {
  const found = PRODUCT.commands.find(({ id }) => id === "time-off/request");

  if (found === undefined) throw new Error("The fixture product has no command time-off/request.");

  return {
    command: found,
    enabled: true,
    keys: "Ctrl+Shift+R",
    label: "Request time off",
    run: running,
  };
}
