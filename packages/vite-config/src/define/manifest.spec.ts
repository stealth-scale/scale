import { readFileSync } from "node:fs";
import { type UserConfig } from "vite";
import { describe, expect, it } from "vitest";

import { type Manifest } from "@stealthscale/vite-config-core";

import { type Injected, manifest } from "#define/manifest.ts";
import { told } from "#vite.fixtures.ts";

function refined(
  stated: Manifest,
  injected: Injected = {},
  env: Record<string, string> = {},
  config: UserConfig = {},
): UserConfig {
  return manifest(injected).refine(told({ env, manifest: stated }), config);
}

function definedBy(
  stated: Manifest,
  injected: Injected = {},
  env: Record<string, string> = {},
): Record<string, string> {
  return refined(stated, injected, env).define as Record<string, string>;
}

const SUBPATH = "./globals";

function declared(): string[] {
  const source = readFileSync(new URL("../../globals.d.ts", import.meta.url).pathname, "utf8");

  return [...source.matchAll(/declare const (\S+):/gu)].map(([, name]) => name ?? "");
}

function own(): Record<string, unknown> {
  return JSON.parse(
    readFileSync(new URL("../../package.json", import.meta.url).pathname, "utf8"),
  ) as Record<string, unknown>;
}

describe("manifest", () => {
  it("injects the package name the manifest declares", () => {
    expect(definedBy({ name: "@acme/thing", version: "1.2.3" })["__NAME__"]).toBe('"@acme/thing"');
  });

  it("injects the package version the manifest declares", () => {
    expect(definedBy({ name: "@acme/thing", version: "1.2.3" })["__VERSION__"]).toBe('"1.2.3"');
  });

  it("encodes every value as JSON", () => {
    const held = definedBy({ name: "@acme/thing", version: "1.2.3" });

    for (const value of Object.values(held)) expect(value.startsWith('"')).toBe(true);
  });

  it("injects an empty string when the manifest declares no name", () => {
    expect(definedBy({})["__NAME__"]).toBe('""');
  });

  it("injects an empty string when the manifest declares no version", () => {
    expect(definedBy({ name: "@acme/thing" })["__VERSION__"]).toBe('""');
  });

  it("injects no constant beyond the name and version when neither option is set", () => {
    const held = definedBy({ name: "@acme/thing", version: "1.2.3" });

    expect(Object.keys(held).toSorted()).toStrictEqual(["__NAME__", "__VERSION__"]);
  });

  it("injects the commit SHA from GITHUB_SHA", () => {
    const held = definedBy({}, { commit: true }, { GITHUB_SHA: "cafe1234" });

    expect(held["__COMMIT__"]).toBe('"cafe1234"');
  });

  it("injects the commit SHA from CI_COMMIT_SHA when GITHUB_SHA is absent", () => {
    const held = definedBy({}, { commit: true }, { CI_COMMIT_SHA: "beef5678" });

    expect(held["__COMMIT__"]).toBe('"beef5678"');
  });

  it("injects an empty string when neither variable is set", () => {
    expect(definedBy({}, { commit: true })["__COMMIT__"]).toBe('""');
  });

  it("injects an ISO 8601 timestamp when builtAt is set", () => {
    expect(definedBy({}, { builtAt: true })["__BUILT_AT__"]).toMatch(/^"\d{4}-\d{2}-\d{2}T/u);
  });

  it("writes the same constants for the packer as for Vite", () => {
    const held = refined({ name: "@acme/thing", version: "1.2.3" });

    expect(held.pack).toStrictEqual({ define: held.define });
  });

  it("writes the constants on every bundle when pack is an array", () => {
    const held = refined({ name: "@acme/thing" }, {}, {}, { pack: [{ dts: true }, {}] });

    expect(held.pack).toStrictEqual([{ define: held.define, dts: true }, { define: held.define }]);
  });

  it("keeps a constant the configuration defined already", () => {
    const held = refined(
      { name: "@acme/thing" },
      {},
      {},
      {
        define: { __OTHER__: "1" },
        pack: { define: { __OTHER__: "1" } },
      },
    );

    expect(held.define?.["__OTHER__"]).toBe("1");
    expect(held.pack).toMatchObject({ define: { __NAME__: '"@acme/thing"', __OTHER__: "1" } });
  });

  it("names the override for the optional constants it injects", () => {
    expect(manifest().name).toBe("define.manifest");
    expect(manifest({ commit: true }).name).toBe("define.manifest(commit)");
    expect(manifest({ builtAt: true, commit: true }).name).toBe("define.manifest(commit, builtAt)");
  });

  it("declares every injected constant in globals.d.ts", () => {
    const injected = Object.keys(definedBy({}, { builtAt: true, commit: true }));

    expect(declared().toSorted()).toStrictEqual(injected.toSorted());
  });

  it("exports the declarations under ./globals", () => {
    const exported = own()["exports"] as Record<string, unknown>;

    expect(exported[SUBPATH], `the packer dropped ${SUBPATH} from exports`).toBe("./globals.d.ts");
  });

  it("exports the declarations under ./globals in publishConfig", () => {
    const published = (own()["publishConfig"] as Record<string, unknown>)["exports"];

    expect((published as Record<string, unknown>)[SUBPATH]).toBe("./globals.d.ts");
  });
});
