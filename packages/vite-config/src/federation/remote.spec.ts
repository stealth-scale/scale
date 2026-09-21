import { describe, expect, it } from "vitest";

import { remote } from "#federation/remote.ts";
import { told } from "#vite.fixtures.ts";

describe("remote", () => {
  it("targets plugins", () => {
    expect(remote({ exposes: {}, name: "one" }).at).toBe("plugins");
  });

  it("resolves itemOf to a plugin when a module is exposed", async () => {
    await expect(
      remote({ exposes: { "./A": "./src/a.ts" }, name: "one" }).itemOf?.(told()),
    ).resolves.toBeDefined();
  });

  it("sets because to a reason naming run time", () => {
    expect(remote({ exposes: {}, name: "one" }).because).toContain("run time");
  });

  it("names the contribution federation.remote with the remote name", () => {
    expect(remote({ exposes: {}, name: "dashboards" }).name).toBe("federation.remote(dashboards)");
  });

  it("resolves itemOf to a plugin when shared is given", async () => {
    const held = remote({ exposes: {}, name: "one", shared: { react: { singleton: true } } });

    await expect(held.itemOf?.(told())).resolves.toBeDefined();
  });
});
