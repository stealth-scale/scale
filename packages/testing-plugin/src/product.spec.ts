import { describe, expect, it } from "vitest";

import { NOBODY } from "@stealthscale/sdk-core";
import { standaloneProduct } from "@stealthscale/sdk-host/standalone";
import { memoryStore } from "@stealthscale/settings";

import { NOTES } from "#manifest.fixtures.ts";
import { ADA, MILK, NOTE, orphanContract } from "#notes.fixtures.ts";
import { productOf, seed, transportOf } from "#product.ts";

const PRODUCT = productOf(standaloneProduct(NOTES));

describe("product", () => {
  it("resolves a definition with each installed plugin's manifest", () => {
    expect(PRODUCT.manifests).toStrictEqual({ notes: NOTES.manifest });
  });

  it("throws naming every problem where the definition does not resolve", () => {
    expect(() => productOf(standaloneProduct({ contract: orphanContract }))).toThrow(
      "The product does not resolve: orphan.requires.0 needs tags, which is not installed.",
    );
  });

  it("writes each switch under the key of the session's subject", () => {
    const store = memoryStore();

    seed(store, PRODUCT, ADA, { switches: { notes: false } });

    expect(store.read("stealth.notes.ada@acme.plugin.notes")).toBe("off");
  });

  it("writes each section's values with the schema's version", () => {
    const store = memoryStore();

    seed(store, PRODUCT, ADA, { settings: { "notes/display": { size: "sm" } } });

    expect(store.read("stealth.notes.ada@acme.settings.notes.display")).toBe(
      '{"values":{"size":"sm"},"version":1}',
    );
  });

  it("writes under anyone for a session nobody signed in to", () => {
    const store = memoryStore();

    seed(store, PRODUCT, NOBODY, { switches: { notes: true } });

    expect(store.read("stealth.notes.anyone.plugin.notes")).toBe("on");
  });

  it("throws for a section no installed plugin declares", () => {
    expect(() => {
      seed(memoryStore(), PRODUCT, ADA, { settings: { "notes/absent": {} } });
    }).toThrow("No installed plugin declares the settings section notes/absent.");
  });

  it("serves a declared operation with its sample's data", async () => {
    await expect(transportOf(PRODUCT, {}).run(NOTE, { id: "n1" })).resolves.toStrictEqual(MILK);
  });

  it("serves an operation the samples name with that sample", async () => {
    const other = { id: "n2", text: "Call the bank" };

    await expect(
      transportOf(PRODUCT, { [NOTE.id]: { data: other } }).run(NOTE, { id: "n2" }),
    ).resolves.toStrictEqual(other);
  });
});
