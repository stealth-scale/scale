/**
 * Covers the access, flag and operation catalogues of a product of two plugins, resolved by
 * `sdk-core`, with words from a catalogue plugin api written out by hand.
 */

import { describe, expect, it, vi } from "vitest";

import {
  defineContract,
  defineMutation,
  definePlugin,
  defineProduct,
  defineQuery,
  entitlement,
  flag,
  installed,
  mutation,
  permission,
  query,
  type ResolvedProduct,
  resolveProduct,
  resource,
  role,
} from "@stealthscale/sdk-core";
import { type Catalogue, type CataloguesApi, type Words } from "@stealthscale/vite-plugin-i18n";

import { type Catalogues, cataloguesFor } from "#catalogues.ts";

/**
 * The plugin `people`: every kind of access declaration, a release flag, a query and a mutation.
 */
const PEOPLE = definePlugin(
  defineContract("people", (self) => ({
    entitlements: { directory: entitlement({ description: "entitlements.directory" }) },
    featureFlags: {
      cards: flag({
        default: false,
        description: "flags.cards",
        expires: "2099-01-01",
        kind: "release",
      }),
    },
    mutations: {
      rename: mutation({
        operation: defineMutation<{ readonly id: string }, { readonly id: string }>("people~1~b"),
        sample: { data: { id: "7" }, variables: { id: "7" } },
      }),
    },
    permissions: {
      "person.edit": permission({
        description: "permissions.edit",
        resource: self.resource("person"),
      }),
      "person.read": permission({ deprecated: "use person.view", description: "permissions.read" }),
    },
    queries: {
      person: query({
        operation: defineQuery<{ readonly id: string }>("people~1~a"),
        sample: { data: { id: "7" }, variables: {} },
      }),
    },
    resources: { person: resource({ description: "resources.person" }) },
    roles: {
      editor: role({ description: "roles.editor", permissions: [self.permission("person.edit")] }),
    },
  })),
  {},
);

/**
 * The plugin `billing`: one permission and one query.
 */
const BILLING = definePlugin(
  defineContract("billing", {
    permissions: { "invoice.pay": permission({ description: "permissions.pay" }) },
    queries: {
      invoice: query({
        operation: defineQuery<{ readonly id: string }>("billing~1~c"),
        sample: { data: { id: "9" }, variables: {} },
      }),
    },
  }),
  {},
);

/**
 * The words of each pair of language and namespace the api finds.
 */
const WORDS: Readonly<Record<string, Words>> = {
  "en/billing": { permissions: { pay: "Pay invoices" } },
  "en/host": { flags: { killSwitch: "Turns the whole plugin off" } },
  "en/people": {
    entitlements: { directory: "Directory" },
    flags: { cards: "Cards" },
    permissions: { edit: "Edit people", read: "Read people" },
    resources: { person: "A person" },
    roles: { editor: "Editor" },
  },
  "nl/people": { permissions: { edit: "Mensen bewerken" } },
};

/**
 * Returns the product of both plugins, `people` installed first, with the release flag set on.
 *
 * @throws {@link Error} When the product does not resolve.
 */
function resolvedProduct(): ResolvedProduct {
  const { problems, product } = resolveProduct(
    defineProduct({
      featureFlags: [{ flag: "people/cards", value: true }],
      name: "product.name",
      plugins: [installed(PEOPLE), installed(BILLING)],
      productId: "acme",
      version: "2.0.0",
    }),
    {
      billing: { directory: "/billing", name: "@acme/billing" },
      people: { directory: "/people", name: "@acme/people" },
    },
    { today: "2026-10-02" },
  );

  if (product === undefined) throw new Error(problems.map(({ reason }) => reason).join("\n"));

  return product;
}

/**
 * Returns an api over {@link WORDS}, whose words function records every call.
 *
 * @param words - The words function. One that reads {@link WORDS} by default.
 */
function apiOf(
  words: CataloguesApi["words"] = (language, namespace) => WORDS[`${language}/${namespace}`] ?? {},
): CataloguesApi {
  const catalogues = Object.keys(WORDS).map((pair): Catalogue => {
    const [language = "", namespace = ""] = pair.split("/");

    return {
      file: `/locales/${pair}.json`,
      language,
      namespace,
      own: false,
      owner: `@acme/${namespace}`,
      prefix: "",
    };
  });

  return { catalogues: () => catalogues, fallback: "en", words };
}

/**
 * Returns the catalogues of the product of both plugins.
 */
function built(): Catalogues {
  return cataloguesFor(resolvedProduct(), apiOf());
}

/**
 * Returns the words of a pair, and throws for every Dutch catalogue.
 *
 * @throws {@link Error} For the language `nl`.
 */
function brokenInDutch(language: string, namespace: string): Words {
  if (language === "nl") throw new Error("broken");

  return WORDS[`${language}/${namespace}`] ?? {};
}

describe("catalogues", () => {
  it("describes a name in every language its plugin's catalogues contain", () => {
    const [, edit] = built().access.permissions;

    expect(edit?.description).toStrictEqual({ en: "Edit people", nl: "Mensen bewerken" });
  });

  it("leaves out a language whose catalogue lacks the key", () => {
    const [, , read] = built().access.permissions;

    expect(read?.description).toStrictEqual({ en: "Read people" });
  });

  it("sorts every access list by qualified id", () => {
    const { permissions } = built().access;

    expect(permissions.map(({ id }) => id)).toStrictEqual([
      "billing/invoice.pay",
      "people/person.edit",
      "people/person.read",
    ]);
  });

  it("writes the resource kind of a scoped permission", () => {
    const { permissions } = built().access;

    expect(permissions.map(({ resource: kind }) => kind)).toStrictEqual([
      undefined,
      "people/person",
      undefined,
    ]);
  });

  it("writes the deprecation note of a deprecated name", () => {
    const { permissions } = built().access;

    expect(permissions.map(({ deprecated }) => deprecated)).toStrictEqual([
      undefined,
      undefined,
      "use person.view",
    ]);
  });

  it("writes the permissions each role grants", () => {
    expect(built().access.roles).toStrictEqual([
      {
        deprecated: undefined,
        description: { en: "Editor" },
        id: "people/editor",
        permissions: ["people/person.edit"],
        plugin: "people",
      },
    ]);
  });

  it("lists every resource kind and every entitlement", () => {
    const { entitlements, resources } = built().access;

    expect(
      [...entitlements, ...resources].map(({ description, id }) => [id, description]),
    ).toStrictEqual([
      ["people/directory", { en: "Directory" }],
      ["people/person", { en: "A person" }],
    ]);
  });

  it("writes the product's id and version on every catalogue", () => {
    const { access, flags, operations } = built();
    const identity = { id: "acme", version: "2.0.0" };

    expect([access.product, flags.product, operations.product]).toStrictEqual([
      identity,
      identity,
      identity,
    ]);
  });

  it("lists every flag with each plugin's kill switch sorted by id", () => {
    expect(built().flags.flags.map(({ id }) => id)).toStrictEqual([
      "host/plugin.billing",
      "host/plugin.people",
      "people/cards",
    ]);
  });

  it("describes a kill switch from the host's catalogue", () => {
    const [kill] = built().flags.flags;

    expect(kill?.description).toStrictEqual({ en: "Turns the whole plugin off" });
  });

  it("writes the product's value of a flag beside the contract's default", () => {
    const [, , cards] = built().flags.flags;

    expect(cards).toStrictEqual({
      default: false,
      deprecated: undefined,
      description: { en: "Cards" },
      expires: "2099-01-01",
      id: "people/cards",
      kind: "release",
      plugin: "people",
      product: true,
      variants: undefined,
    });
  });

  it("lists each plugin's queries before its mutations in install order", () => {
    expect(built().operations.operations).toStrictEqual([
      { id: "people~1~a", kind: "query", name: "person", plugin: "people" },
      { id: "people~1~b", kind: "mutation", name: "rename", plugin: "people" },
      { id: "billing~1~c", kind: "query", name: "invoice", plugin: "billing" },
    ]);
  });

  it("reads each pair of language and namespace once", () => {
    const words = vi.fn<CataloguesApi["words"]>(
      (language, namespace) => WORDS[`${language}/${namespace}`] ?? {},
    );

    cataloguesFor(resolvedProduct(), apiOf(words));

    expect(
      words.mock.calls.map(([language, namespace]) => `${language}/${namespace}`).toSorted(),
    ).toStrictEqual(["en/billing", "en/host", "en/people", "nl/people"]);
  });

  it("throws naming the plugin and the language when a catalogue cannot be read", () => {
    expect(() => cataloguesFor(resolvedProduct(), apiOf(brokenInDutch))).toThrow(
      "The catalogue of people in nl cannot be read: Error: broken",
    );
  });
});
