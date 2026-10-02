import { describe, expect, it } from "vitest";

import { defineContract, definePlugin, route } from "@stealthscale/sdk-core";

import { caseNamed, worded } from "#checks.fixtures.ts";
import { lazy } from "#notes.fixtures.ts";
import { wordCases } from "#words.ts";

function page(): string {
  return "page";
}

function subjectOf(pluginId: string): Parameters<typeof wordCases>[0] {
  const contract = defineContract(pluginId, () => ({
    routes: { home: route({ navigation: { label: "navigation.home" }, path: pluginId }) },
    version: "1.0.0",
  }));

  return {
    beside: [],
    contract,
    manifest: definePlugin(contract, { routes: { home: lazy({ page }) } }),
  };
}

const KEYS = "every key the contract names is in the fallback catalogue";

describe("wordCases", () => {
  it("names the cases of a plugin's words", () => {
    expect(wordCases(subjectOf("diary")).map(({ name }) => name)).toStrictEqual([
      KEYS,
      "plugin.name is in the fallback catalogue",
      "plugin.description is in the fallback catalogue",
    ]);
  });

  it("passes a catalogue that has every key the contract names", async () => {
    worded("atlas", {
      navigation: { home: "Atlas" },
      plugin: { description: "Maps", name: "Atlas" },
    });

    await expect(caseNamed(wordCases(subjectOf("atlas")), KEYS).run()).resolves.toBeUndefined();
  });

  it("fails a catalogue that lacks a key the contract names", async () => {
    worded("budget", { plugin: { description: "Money", name: "Budget" } });

    await expect(caseNamed(wordCases(subjectOf("budget")), KEYS).run()).rejects.toThrow(
      "budget.routes.home.navigation.label names the key navigation.home, which the fallback catalogue of budget lacks",
    );
  });

  it("ignores a fault the build reports without the catalogue", async () => {
    worded("garden", { navigation: { home: "Garden" } });

    const subject = subjectOf("garden");
    const uncoded = { ...subject, manifest: { ...subject.manifest, code: {} } };

    await expect(caseNamed(wordCases(uncoded), KEYS).run()).resolves.toBeUndefined();
  });

  it("fails every key where the plugin has no catalogue", async () => {
    await expect(caseNamed(wordCases(subjectOf("cellar")), KEYS).run()).rejects.toThrow(
      "cellar has no catalogue in the fallback language.",
    );
  });

  it("passes plugin.name where the catalogue states it", async () => {
    worded("depot", { plugin: { name: "Depot" } });

    const found = caseNamed(
      wordCases(subjectOf("depot")),
      "plugin.name is in the fallback catalogue",
    );

    await expect(found.run()).resolves.toBeUndefined();
  });

  it("fails plugin.description where the catalogue lacks it", async () => {
    worded("estate", { plugin: { name: "Estate" } });

    const found = caseNamed(
      wordCases(subjectOf("estate")),
      "plugin.description is in the fallback catalogue",
    );

    await expect(found.run()).rejects.toThrow(
      "The fallback catalogue of estate lacks plugin.description.",
    );
  });

  it("fails plugin.name where the catalogue states a word at plugin", async () => {
    worded("hollow", { plugin: "Hollow" });

    const found = caseNamed(
      wordCases(subjectOf("hollow")),
      "plugin.name is in the fallback catalogue",
    );

    await expect(found.run()).rejects.toThrow(
      "The fallback catalogue of hollow lacks plugin.name.",
    );
  });

  it("reads the catalogues of the plugins installed beside", async () => {
    worded("inlet", { navigation: { home: "Inlet" } });
    worded("jetty", { navigation: { home: "Jetty" } });

    const subject = { ...subjectOf("inlet"), beside: [subjectOf("jetty").contract] };

    await expect(caseNamed(wordCases(subject), KEYS).run()).resolves.toBeUndefined();
  });

  it("fails plugin.name where the plugin has no catalogue", async () => {
    const found = caseNamed(
      wordCases(subjectOf("forge")),
      "plugin.name is in the fallback catalogue",
    );

    await expect(found.run()).rejects.toThrow("The fallback catalogue of forge lacks plugin.name.");
  });
});
