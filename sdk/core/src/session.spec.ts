import { describe, expect, it } from "vitest";

import { constantSession, NOBODY, type Session, subjectOf } from "#session.ts";

const ADA: Session = {
  authenticated: true,
  entitlements: ["time-off/module"],
  permissions: ["time-off/request.read"],
  roles: [],
  tenantId: "acme",
  userId: "ada",
};

describe("session", () => {
  it("states nobody as a session that is not signed in", () => {
    expect(NOBODY).toStrictEqual({
      authenticated: false,
      entitlements: [],
      permissions: [],
      roles: [],
    });
  });

  it("returns the person and the tenant as the subject", () => {
    expect(subjectOf(ADA)).toBe("ada@acme");
  });

  it("returns the same subject for a session renewed for the same person", () => {
    expect(subjectOf({ ...ADA, permissions: [] })).toBe(subjectOf(ADA));
  });

  it("returns another subject after a tenant switch", () => {
    expect(subjectOf({ ...ADA, tenantId: "globex" })).not.toBe(subjectOf(ADA));
  });

  it("returns a subject without a tenant where the product has none", () => {
    expect(subjectOf({ ...ADA, tenantId: undefined })).toBe("ada@");
  });

  it("returns a subject without a person where the session names none", () => {
    expect(subjectOf({ ...ADA, userId: undefined })).toBe("@acme");
  });

  it("returns no subject for nobody", () => {
    expect(subjectOf(NOBODY)).toBeUndefined();
  });

  it("reads the same session from a constant source", () => {
    expect(constantSession(ADA).read()).toBe(ADA);
  });

  it("returns a function that stops nothing from a constant source", () => {
    const stop = constantSession(ADA).subscribe(() => {
      throw new Error("A constant source called its listener.");
    });

    stop();

    expect(stop).toBeTypeOf("function");
  });
});
