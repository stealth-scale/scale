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
  it("contributes at the plugins key", () => {
    expect(inventory().at).toBe("plugins");
  });

  it("applies to the build command", () => {
    expect(inventory().apply).toBe("build");
  });

  it("names the contribution build.inventory", () => {
    expect(inventory().name).toBe("build.inventory");
  });

  it("constructs the plugin when the configuration is composed", () => {
    expect(inventory().item).toBeUndefined();
  });

  it("writes the document to the served path and the output path", async () => {
    expect([...(await written()).keys()].toSorted()).toStrictEqual([
      ".well-known/sbom",
      "cyclonedx/bom.json",
    ]);
  });

  it("writes the same document to both paths", async () => {
    const held = await written();

    expect(held.get(".well-known/sbom")).toBe(held.get("cyclonedx/bom.json"));
  });

  it("types the component as an application", async () => {
    expect(((await metadata())["component"] as Record<string, unknown>)["type"]).toBe(
      "application",
    );
  });

  it("records the house identity as the supplier by default", async () => {
    expect(((await metadata())["supplier"] as Record<string, unknown>)["name"]).toBe(
      "Stealth Scale B.V.",
    );
  });

  it("records the supplier the caller passes", async () => {
    const source = await written({}, { name: "Acme", url: ["https://acme.example"] });
    const held = JSON.parse(source.get("cyclonedx/bom.json") ?? "{}") as Record<string, unknown>;
    const supplier = (held["metadata"] as Record<string, unknown>)["supplier"];

    expect((supplier as Record<string, unknown>)["name"]).toBe("Acme");
  });

  it("writes a serial number when the mode is production", async () => {
    const held = await document("cyclonedx/bom.json", { mode: "production" });

    expect(held["serialNumber"]).toBeDefined();
  });

  it("writes a timestamp when the mode is production", async () => {
    const held = await metadata({ mode: "production" });

    expect(held["timestamp"]).toBeDefined();
  });

  it("omits the serial number when the mode is development", async () => {
    const held = await document("cyclonedx/bom.json");

    expect(held["serialNumber"]).toBeUndefined();
  });

  it("omits the timestamp when the mode is development", async () => {
    expect((await metadata())["timestamp"]).toBeUndefined();
  });
});
