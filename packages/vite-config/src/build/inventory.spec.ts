import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { type Context } from "@stealthscale/vite-config-core";

import { inventory } from "#build/inventory.ts";
import { told } from "#vite.fixtures.ts";

interface Writing {
  configResolved: (config: { root: string }) => void;
  generateBundle: (this: unknown) => void;
}

function isWriting(value: unknown): value is Writing {
  return typeof value === "object" && value !== null && "generateBundle" in value;
}

function described(): string {
  const at = mkdtempSync(join(tmpdir(), "stealth-build-inventory-"));

  writeFileSync(join(at, "package.json"), JSON.stringify({ name: "one", version: "1.0.0" }));

  return at;
}

async function written(
  stated: Partial<Context> = {},
  supplier?: Parameters<typeof inventory>[0],
): Promise<Map<string, string>> {
  const held = new Map<string, string>();
  const plugin: unknown = await inventory(supplier).itemOf?.(told(stated));

  if (!isWriting(plugin)) throw new Error("the contribution built no plugin");

  plugin.configResolved({ root: described() });
  plugin.generateBundle.call({
    emitFile: (file: { fileName: string; source: string }) => held.set(file.fileName, file.source),
    getModuleIds: () => [],
  });

  return held;
}

async function document(
  at: string,
  stated: Partial<Context> = {},
): Promise<Record<string, unknown>> {
  return JSON.parse((await written(stated)).get(at) ?? "{}") as Record<string, unknown>;
}

async function metadata(stated: Partial<Context> = {}): Promise<Record<string, unknown>> {
  return (await document("cyclonedx/bom.json", stated))["metadata"] as Record<string, unknown>;
}

describe("inventory", () => {
  it("appends to the bundler's plugins rather than replacing them", () => {
    expect(inventory().at).toBe("plugins");
  });

  it("applies to the build and not to the dev server", () => {
    expect(inventory().apply).toBe("build");
  });

  it("names the layer so a repository can remove it", () => {
    expect(inventory().name).toBe("build.inventory");
  });

  it("constructs the plugin when the configuration is composed and not when the layer is stated", () => {
    expect(inventory().item).toBeUndefined();
  });

  it("writes one copy beside the output and one where a scanner reaches for it", async () => {
    expect([...(await written()).keys()].toSorted()).toStrictEqual([
      ".well-known/sbom",
      "cyclonedx/bom.json",
    ]);
  });

  it("writes the same document to both paths", async () => {
    const held = await written();

    expect(held.get(".well-known/sbom")).toBe(held.get("cyclonedx/bom.json"));
  });

  it("describes an application", async () => {
    expect(((await metadata())["component"] as Record<string, unknown>)["type"]).toBe(
      "application",
    );
  });

  it("supplies the house", async () => {
    expect(((await metadata())["supplier"] as Record<string, unknown>)["name"]).toBe(
      "Stealth Scale B.V.",
    );
  });

  it("supplies the author the repository names instead", async () => {
    const source = await written({}, { name: "Acme", url: ["https://acme.example"] });
    const held = JSON.parse(source.get("cyclonedx/bom.json") ?? "{}") as Record<string, unknown>;
    const supplier = (held["metadata"] as Record<string, unknown>)["supplier"];

    expect((supplier as Record<string, unknown>)["name"]).toBe("Acme");
  });

  it("includes a serial number and a timestamp for a release", async () => {
    const held = await document("cyclonedx/bom.json", { mode: "production" });

    expect(held["serialNumber"]).toBeDefined();
    expect((held["metadata"] as Record<string, unknown>)["timestamp"]).toBeDefined();
  });

  it("includes neither in development", async () => {
    const held = await document("cyclonedx/bom.json");

    expect(held["serialNumber"]).toBeUndefined();
    expect((held["metadata"] as Record<string, unknown>)["timestamp"]).toBeUndefined();
  });
});
