import { type Mock, vi } from "vitest";

import {
  defineContract,
  definePlugin,
  installed,
  params,
  type Product,
  type ResolvedRoute,
  route,
  type SearchSchema,
} from "@stealthscale/sdk-core";

import { withCode } from "#host/host.fixtures.ts";
import { type Host } from "#host/options.ts";
import {
  billing,
  lazy,
  payroll,
  PRODUCT,
  productOf,
  timeOff,
  timeOffContract,
} from "#host/product.fixtures.ts";
import { Broken, Mended, Overview, Scoped } from "#routes/pages.fixtures.tsx";

export const OPEN_TAB: SearchSchema<{ readonly tab: string }> = {
  "~standard": {
    validate: () => ({ value: { tab: "open" } }),
    vendor: "fixture",
    version: 1,
  },
};

export const identityContract = defineContract("identity", () => ({
  routes: {
    account: route({ path: "account", search: OPEN_TAB, when: { authenticated: true } }),
    request: route({
      ...params<{ readonly id: string }>(),
      data: [{ query: timeOffContract.queries.request, variables: ["id"] }],
      path: "requests/$id",
      sample: { id: "7" },
    }),
    signIn: route({ path: "sign-in", when: { authenticated: false } }),
  },
  version: "1.0.0",
}));

export const identity = definePlugin(identityContract, {
  routes: { account: lazy({ Overview }), request: lazy({ Overview }), signIn: lazy({ Overview }) },
});

export const GUARDED: Product = productOf(
  [installed(identity), installed(timeOff), installed(billing), installed(payroll)],
  { signIn: identityContract.routes.signIn, when: { authenticated: true } },
);

export const UNGUARDED: Product = productOf([
  installed(identity),
  installed(timeOff),
  installed(billing),
  installed(payroll),
]);

export const SWITCHED: Product = productOf([
  installed(timeOff),
  installed(billing, { enabled: false }),
  installed(payroll),
]);

export const STOPPED: Product = productOf([
  installed(timeOff, { enabled: false }),
  installed(billing),
  installed(payroll),
]);

export const CONDITIONED: Product = productOf([
  installed(timeOff),
  installed(billing, { when: { authenticated: false } }),
  installed(payroll),
]);

export const BROKEN: Product = withCode(PRODUCT, "billing", {
  routes: { invoices: lazy({ Broken }) },
});

export const MENDED: Product = withCode(PRODUCT, "billing", {
  routes: { invoices: { component: lazy({ Broken }), fallback: lazy({ Mended }) } },
});

export const SCOPED: Product = withCode(PRODUCT, "billing", {
  routes: { invoices: { component: lazy({ Broken }), fallback: lazy({ Scoped }) } },
});

export const SCOPED_PAGE: Product = withCode(PRODUCT, "billing", {
  routes: { invoices: lazy({ Scoped }) },
});

export const TWICE: Product = withCode(PRODUCT, "billing", {
  routes: { invoices: lazy({ Mended, Overview }) },
});

export type Import = () => Promise<Readonly<Record<string, never>>>;

export function preloading(): readonly [Product, Mock<Import>] {
  const load = vi.fn<Import>(() => Promise.resolve({}));
  const product = withCode(PRODUCT, "billing", {
    extensions: { total: { component: load } },
    routes: { invoices: lazy({ Overview }) },
  });

  return [product, load];
}

export function silenced(): void {
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
}

export const INVOICES = "route:billing/invoices";

export function failInvoicesOnce(host: Host): void {
  host.stores.quarantine.failed(INVOICES, new Error("broken"));
}

export function routeIn(product: Product, id: string): ResolvedRoute {
  const found = product.routes.find((one) => one.id === id);

  if (found === undefined) throw new Error(`The fixture product has no route ${id}.`);

  return found;
}

export function thrownBy(run: () => unknown): unknown {
  try {
    run();
  } catch (error: unknown) {
    return error;
  }

  throw new Error("The call threw nothing.");
}
