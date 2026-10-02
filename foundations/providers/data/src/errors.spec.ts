import { describe, expect, it } from "vitest";

import { DataError, type DataIssue, fieldErrorsOf, kindOf } from "#errors.ts";

/**
 * Builds an issue at a path, with a keyword and no values.
 *
 * @param path - The refused value's path.
 * @param keyword - The service's code for the refusal.
 * @returns The issue.
 */
function issue(path: ReadonlyArray<number | string>, keyword = "minimum"): DataIssue {
  return { keyword, message: `${keyword} refused`, path, values: {} };
}

/**
 * Builds an `invalid` refusal of a mutation with the issues given.
 *
 * @param issues - The refused values.
 * @returns The error.
 */
function refused(issues: readonly DataIssue[]): DataError {
  return new DataError({
    issues,
    kind: "invalid",
    message: "refused",
    operation: "people~1~41b0d2",
  });
}

describe("DataError", () => {
  it("names itself DataError", () => {
    expect(refused([]).name).toBe("DataError");
  });

  it("keeps the kind and the operation it was created with", () => {
    const error = new DataError({
      kind: "conflict",
      message: "stale",
      operation: "people~1~41b0d2",
    });

    expect([error.kind, error.operation, error.message]).toStrictEqual([
      "conflict",
      "people~1~41b0d2",
      "stale",
    ]);
  });

  it("has no issues where none were given", () => {
    const error = new DataError({ kind: "server", message: "down", operation: "people~1~9c1e7a" });

    expect(error.issues).toStrictEqual([]);
  });

  it("keeps the status where a response arrived", () => {
    const error = new DataError({
      kind: "server",
      message: "down",
      operation: "people~1~9c1e7a",
      status: 503,
    });

    expect(error.status).toBe(503);
  });

  it("states no status where no response arrived", () => {
    const error = new DataError({
      kind: "network",
      message: "offline",
      operation: "people~1~9c1e7a",
    });

    expect(error.status).toBeUndefined();
  });

  it("keeps the cause it was created with", () => {
    const cause = new TypeError("Failed to fetch");
    const error = new DataError({ cause, kind: "network", message: "offline", operation: "x~1~1" });

    expect(error.cause).toBe(cause);
  });
});

describe("kindOf", () => {
  it.each([
    { code: "BAD_USER_INPUT", want: "invalid" },
    { code: "CONFLICT", want: "conflict" },
    { code: "FORBIDDEN", want: "forbidden" },
    { code: "NOT_FOUND", want: "not-found" },
    { code: "UNAUTHENTICATED", want: "unauthenticated" },
    { code: "INTERNAL_SERVER_ERROR", want: "server" },
  ])("returns $want for the code $code", ({ code, want }) => {
    expect(kindOf(code, 200)).toBe(want);
  });

  it("reads the code ahead of the status", () => {
    expect(kindOf("FORBIDDEN", 500)).toBe("forbidden");
  });

  it.each([
    { status: 400, want: "invalid" },
    { status: 401, want: "unauthenticated" },
    { status: 403, want: "forbidden" },
    { status: 404, want: "not-found" },
    { status: 409, want: "conflict" },
    { status: 422, want: "invalid" },
    { status: 429, want: "server" },
    { status: 503, want: "server" },
  ])("returns $want for the status $status without a code", ({ status, want }) => {
    expect(kindOf(undefined, status)).toBe(want);
  });
});

describe("fieldErrorsOf", () => {
  it("returns nothing for an error that is not a data error", () => {
    expect(fieldErrorsOf(new Error("boom"))).toBeUndefined();
  });

  it("returns nothing for a refusal of another kind", () => {
    const error = new DataError({ kind: "forbidden", message: "no", operation: "x~1~1" });

    expect(fieldErrorsOf(error)).toBeUndefined();
  });

  it("keys each issue by the name a form gives its field", () => {
    const amount = issue(["lines", 0, "amount"]);

    expect(fieldErrorsOf(refused([amount]))).toStrictEqual({
      fields: { "lines[0].amount": amount },
    });
  });

  it("keeps the first issue a field receives", () => {
    const first = issue(["name"], "minLength");

    expect(fieldErrorsOf(refused([first, issue(["name"], "pattern")]))?.fields).toStrictEqual({
      name: first,
    });
  });

  it("returns an issue at the root as the refusal of the whole form", () => {
    const quota = issue([], "quota");

    expect(fieldErrorsOf(refused([quota]))).toStrictEqual({ fields: {}, form: quota });
  });

  it("keeps the first issue at the root", () => {
    const quota = issue([], "quota");

    expect(fieldErrorsOf(refused([quota, issue([], "closed")]))?.form).toBe(quota);
  });

  it("names an index at the start of a path in brackets", () => {
    const row = issue([2, "amount"]);

    expect(fieldErrorsOf(refused([row]))?.fields).toStrictEqual({ "[2].amount": row });
  });
});
