import { describe, expect, it, vi } from "vitest";

import { endpoints, join, where } from "#endpoints.ts";

/**
 * Records the arguments `registerRemotes` was called with, one array per call.
 */
const registered: unknown[][] = [];

vi.mock(import("@module-federation/runtime"), () => ({
  registerRemotes: (held: unknown[]): void => {
    registered.push(held);
  },
}));

/**
 * Stubs `fetch` to resolve one body for every request.
 *
 * @param body - The parsed contents of the remotes file.
 * @param ok - Whether the response reports success.
 */
function serving(body: unknown, ok = true): void {
  vi.stubGlobal("fetch", () =>
    Promise.resolve({ json: () => Promise.resolve(body), ok, status: ok ? 200 : 404 }),
  );
}

describe("endpoints", () => {
  it("returns every endpoint the remotes file declares", async () => {
    serving([{ entry: "https://app1.example.test/remoteEntry.js", name: "remote" }]);

    await expect(endpoints("/remotes.json")).resolves.toStrictEqual([
      { entry: "https://app1.example.test/remoteEntry.js", name: "remote" },
    ]);
  });

  it("returns an empty array when no entry declares both entry and name", async () => {
    serving([{ name: "remote" }, { entry: "https://a.test/e.js" }, 7, null]);

    await expect(endpoints("/remotes.json")).resolves.toStrictEqual([]);
  });

  it("returns an empty array when the file declares no endpoint", async () => {
    serving([]);

    await expect(endpoints("/remotes.json")).resolves.toStrictEqual([]);
  });

  it("returns an empty array when the file parses to an object", async () => {
    serving({ remote: "https://a.test/e.js" });

    await expect(endpoints("/remotes.json")).resolves.toStrictEqual([]);
  });

  it("rejects when the response reports 404", async () => {
    serving(undefined, false);

    await expect(endpoints("/remotes.json")).rejects.toThrow(/was answered 404/u);
  });

  it("registers every endpoint with a module type", () => {
    join([{ entry: "https://app1.example.test/remoteEntry.js", name: "remote" }]);

    expect(registered.at(-1)).toStrictEqual([
      { entry: "https://app1.example.test/remoteEntry.js", name: "remote", type: "module" },
    ]);
  });

  it("registers nothing when the endpoint list is empty", () => {
    join([]);

    expect(registered.at(-1)).toStrictEqual([]);
  });

  it("resolves the remotes path under a path-only base", () => {
    expect(where("/")).toBe("/remotes.json");
    expect(where("/design/")).toBe("/design/remotes.json");
    expect(where("/design")).toBe("/design/remotes.json");
  });

  it("resolves the remotes path at the origin root when the base names a host", () => {
    expect(where("https://cdn.example.test/assets/")).toBe("/remotes.json");
  });
});
