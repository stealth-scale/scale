import { describe, expect, it } from "vitest";

import { ENTRY, type Exposed, type Remotes, type Shared, UNSET } from "#federation/settings.ts";

describe("settings", () => {
  it("sets ENTRY to remoteEntry.js without a content hash", () => {
    expect(ENTRY).toBe("remoteEntry.js");
    expect(ENTRY).not.toMatch(/-[A-Za-z0-9_]{8}\./u);
  });

  it("maps an exposed specifier to a path inside the remote", () => {
    const held: Exposed = { "./Dashboard": "./src/dashboard.tsx" };

    expect(held["./Dashboard"]).toBe("./src/dashboard.tsx");
  });

  it("lists a remote by name alone", () => {
    const held: Remotes = ["remote"];

    expect(held).toStrictEqual(["remote"]);
  });

  it("sets UNSET to a host under the reserved .invalid domain", () => {
    expect(UNSET).toContain(".invalid");
  });

  it("reads singleton from a shared dependency entry", () => {
    const held: Shared = { react: { requiredVersion: "^19.0.0", singleton: true } };

    expect(held["react"]?.singleton).toBe(true);
  });
});
