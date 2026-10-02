import { describe, expect, it } from "vitest";

import { flagIs } from "@stealthscale/sdk-core";
import { standaloneProduct } from "@stealthscale/sdk-host/standalone";

import { permitted } from "#checks.fixtures.ts";
import { NOTES } from "#manifest.fixtures.ts";
import { notesContract, tagsContract } from "#notes.fixtures.ts";
import { productOf } from "#product.ts";
import { satisfiedBy, satisfiedFor } from "#satisfied.ts";

const PRODUCT = productOf(standaloneProduct(NOTES));

const { archive, layout } = notesContract.featureFlags;

const SIGNED_IN = {
  authenticated: true,
  entitlements: ["notes/notes"],
  permissions: ["notes/note.edit", "notes/note.read"],
  roles: [],
};

describe("satisfiedBy", () => {
  it("returns no options for a declaration without a condition", () => {
    expect(satisfiedBy(PRODUCT)).toStrictEqual({});
  });

  it("returns no options for a condition no context makes true", () => {
    const when = { allOf: [permitted("notes/note.read"), { not: permitted("notes/note.read") }] };

    expect(satisfiedBy(PRODUCT, when)).toStrictEqual({});
  });

  it("returns no options for a condition whose atoms make more contexts than the bound", () => {
    const when = { allOf: Array.from({ length: 17 }, (_, index) => permitted(`notes/p${index}`)) };

    expect(satisfiedBy(PRODUCT, when)).toStrictEqual({});
  });

  it("keeps the standalone session for a condition it satisfies", () => {
    expect(satisfiedBy(PRODUCT, permitted("notes/note.read"))).toStrictEqual({
      flags: {},
      session: SIGNED_IN,
      switches: {},
    });
  });

  it("signs the session out for a condition on a signed-out person", () => {
    expect(satisfiedBy(PRODUCT, { authenticated: false }).session).toStrictEqual({
      ...SIGNED_IN,
      authenticated: false,
    });
  });

  it("leaves out a permission the condition refuses", () => {
    const { session } = satisfiedBy(PRODUCT, { not: permitted("notes/note.edit") });

    expect(session?.permissions).toStrictEqual(["notes/note.read"]);
  });

  it("leaves out an entitlement the condition refuses", () => {
    const when = { not: { entitlement: { id: "notes/notes", kind: "entitlement" as const } } };

    expect(satisfiedBy(PRODUCT, when).session?.entitlements).toStrictEqual([]);
  });

  it("turns off a boolean flag the condition refuses", () => {
    expect(satisfiedBy(PRODUCT, { not: { featureFlag: archive } }).flags).toStrictEqual({
      "notes/archive": false,
    });
  });

  it("serves the variant the condition names", () => {
    expect(satisfiedBy(PRODUCT, { variant: flagIs(layout, "grid") }).flags).toStrictEqual({
      "notes/layout": "grid",
    });
  });

  it("leaves an experiment at its default where the condition needs a variant it names none of", () => {
    const when = { not: { variant: flagIs(layout, "grid") } };

    expect(satisfiedBy(PRODUCT, when).flags).toStrictEqual({});
  });

  it("switches off a plugin the condition refuses", () => {
    expect(satisfiedBy(PRODUCT, { not: { plugin: tagsContract } }).switches).toStrictEqual({
      tags: false,
    });
  });

  it("returns a plugin's options under the first context that makes its condition true", () => {
    const subject = { ...NOTES, beside: [] };

    expect(satisfiedFor(subject, { authenticated: false })).toStrictEqual({
      ...subject,
      flags: {},
      session: { ...SIGNED_IN, authenticated: false },
      switches: {},
    });
  });
});
