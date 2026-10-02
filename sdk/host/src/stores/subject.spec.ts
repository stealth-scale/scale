import { describe, expect, it } from "vitest";

import { NOBODY } from "@stealthscale/sdk-core";

import { ADA } from "#stores/session.fixtures.ts";
import { subjectFor } from "#stores/subject.ts";

describe("subjectFor", () => {
  it("returns the person and the tenant of a signed-in session", () => {
    expect(subjectFor({ entitlements: new Set(), permissions: new Set(), session: ADA })).toBe(
      "ada@acme",
    );
  });

  it("returns anyone for a session nobody signed in to", () => {
    expect(subjectFor({ entitlements: new Set(), permissions: new Set(), session: NOBODY })).toBe(
      "anyone",
    );
  });
});
