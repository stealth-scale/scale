import { describe, expect, it } from "vitest";

import { type Loaded, plugged } from "#federation/plugged.ts";

const STATED = { filename: "remoteEntry.js", name: "shell", remotes: {} };

function loading(): Promise<Loaded> {
  return Promise.resolve({
    federation: (options: unknown) => ({ name: "federation", options }),
  } as unknown as Loaded);
}

function refusing(): Promise<Loaded> {
  return Promise.resolve({
    federation: () => {
      throw new Error("remotes must be an object");
    },
  } as unknown as Loaded);
}

describe("plugged", () => {
  it("returns the plugin the loader built from the options", async () => {
    const held = (await plugged(STATED, loading)) as unknown as {
      name: string;
      options: typeof STATED;
    };

    expect(held.name).toBe("federation");
    expect(held.options).toStrictEqual(STATED);
  });

  it("throws naming the package to install when the loader rejects", async () => {
    await expect(plugged(STATED, () => Promise.reject(new Error("not installed")))).rejects.toThrow(
      /@module-federation\/vite installed/u,
    );
  });

  it("resolves the installed package when load is absent", async () => {
    await expect(plugged(STATED)).resolves.toBeDefined();
  });

  it("throws the plugin's own error when the plugin rejects the options", async () => {
    await expect(plugged(STATED, refusing)).rejects.toThrow("remotes must be an object");
  });
});
