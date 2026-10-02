import { describe, expect, it } from "vitest";

import { flagIs } from "@stealthscale/sdk-core";

import { permitted } from "#checks.fixtures.ts";
import { BOUND, sidesOf } from "#conditions.ts";
import { notesContract, tagsContract } from "#notes.fixtures.ts";

const LAYOUT = notesContract.featureFlags.layout;

describe("sidesOf", () => {
  it("finds both values of a condition on one permission", () => {
    expect(sidesOf(permitted("notes/note.read"))).toStrictEqual({
      contexts: 2,
      falseSide: true,
      trueSide: true,
    });
  });

  it("finds the one context where the session has one permission without another", () => {
    const when = { allOf: [permitted("notes/note.read"), { not: permitted("notes/note.edit") }] };

    expect(sidesOf(when)).toStrictEqual({ contexts: 4, falseSide: true, trueSide: true });
  });

  it("finds no true side where a condition denies the permission it requires", () => {
    const when = { allOf: [permitted("notes/note.read"), { not: permitted("notes/note.read") }] };

    expect(sidesOf(when).trueSide).toBe(false);
  });

  it("finds no false side where either value of authenticated passes", () => {
    const when = { anyOf: [{ authenticated: true }, { authenticated: false }] };

    expect(sidesOf(when).falseSide).toBe(false);
  });

  it("counts each named variant of an experiment with one other", () => {
    expect(sidesOf({ variant: flagIs(LAYOUT, "grid") })).toStrictEqual({
      contexts: 2,
      falseSide: true,
      trueSide: true,
    });
  });

  it("counts three contexts for a field compared with one value", () => {
    expect(sidesOf({ field: { equals: "open", path: "status" } })).toStrictEqual({
      contexts: 3,
      falseSide: true,
      trueSide: true,
    });
  });

  it("finds a present field through a value no condition compares it with", () => {
    expect(sidesOf({ field: { exists: true, path: "status" } })).toStrictEqual({
      contexts: 2,
      falseSide: true,
      trueSide: true,
    });
  });

  it("reads every atom of nested conditions", () => {
    const when = {
      anyOf: [
        { entitlement: { id: "notes/notes", kind: "entitlement" as const } },
        { not: { featureFlag: notesContract.featureFlags.archive } },
      ],
      plugin: tagsContract,
      route: notesContract.routes.list,
    };

    expect(sidesOf(when).contexts).toBe(16);
  });

  it("searches no context where the atoms make more contexts than the bound", () => {
    const when = { allOf: Array.from({ length: 17 }, (_, index) => permitted(`notes/p${index}`)) };

    expect(sidesOf(when)).toStrictEqual({
      contexts: BOUND * 2,
      falseSide: false,
      trueSide: false,
    });
  });

  it("evaluates one context for a condition that reads no atom", () => {
    expect(sidesOf({})).toStrictEqual({ contexts: 1, falseSide: false, trueSide: true });
  });
});
