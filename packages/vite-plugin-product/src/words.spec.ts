/**
 * Covers the words the resolver checks and the hints beside its problems, built from a catalogue
 * plugin api written out by hand.
 */

import { describe, expect, it } from "vitest";

import { type PluginPackage } from "@stealthscale/sdk-core";
import { withScratchWorkspace } from "@stealthscale/testing";
import { type Catalogue, type CataloguesApi } from "@stealthscale/vite-plugin-i18n";

import { hintsOf, wordsOf } from "#words.ts";

/**
 * The installed plugin's contract package, by plugin id.
 */
const CONTRACTS = { "time-off": { directory: "/contract", name: "@acme/time-off-contract" } };

/**
 * Returns a catalogue of a namespace in a language, from a package or from the application.
 *
 * @param namespace - The catalogue's namespace.
 * @param owner - Name of the package the catalogue is in.
 * @param language - The catalogue's language. English by default.
 * @param own - Whether the application contains the catalogue. False by default.
 */
function catalogue(namespace: string, owner: string, language = "en", own = false): Catalogue {
  return {
    file: `/${owner}/locales/${language}/${namespace}.json`,
    language,
    namespace,
    own,
    owner,
    prefix: "",
  };
}

/**
 * Returns an api over the catalogues given, whose words name their language and namespace.
 */
function apiOf(catalogues: readonly Catalogue[]): CataloguesApi {
  return {
    catalogues: () => catalogues,
    fallback: "en",
    words: (language, namespace) => ({ language, namespace }),
  };
}

/**
 * Returns the hints for one contract package, at a directory of a scratch tree that contains one
 * package with catalogues and one without.
 *
 * @param directory - `catalogued` or `bare`.
 * @param name - The contract package's name.
 * @param catalogues - The catalogues the api found. None by default.
 */
function hintedFor(
  directory: string,
  name: string,
  catalogues: readonly Catalogue[] = [],
): readonly string[] {
  const files = {
    "bare/package.json": JSON.stringify({ name }),
    "catalogued/locales/en/time-off.json": JSON.stringify({ plugin: { name: "Time off" } }),
    "catalogued/package.json": JSON.stringify({ name }),
  };

  return withScratchWorkspace(files, (workspace) => {
    const contracts: Readonly<Record<string, PluginPackage>> = {
      "time-off": { directory: workspace.path(directory), name },
    };

    return hintsOf(apiOf(catalogues), contracts);
  });
}

describe("words", () => {
  it("returns the fallback words of each namespace with a fallback catalogue", () => {
    const api = apiOf([catalogue("time-off", "@acme/time-off-contract")]);

    expect(wordsOf(api, CONTRACTS).catalogues).toStrictEqual({
      "time-off": { language: "en", namespace: "time-off" },
    });
  });

  it("leaves out a namespace without a catalogue in the fallback language", () => {
    const api = apiOf([catalogue("time-off", "@acme/time-off-contract", "nl")]);

    expect(wordsOf(api, CONTRACTS).catalogues).toStrictEqual({});
  });

  it("lists the packages other than the contract package that publish a namespace", () => {
    const api = apiOf([
      catalogue("time-off", "@acme/time-off-contract"),
      catalogue("time-off", "@acme/time-off"),
    ]);

    expect(wordsOf(api, CONTRACTS).namespaces).toStrictEqual({ "time-off": ["@acme/time-off"] });
  });

  it("leaves the application's own catalogues out of the publishers", () => {
    const api = apiOf([catalogue("time-off", "@acme/people", "en", true)]);

    expect(wordsOf(api, CONTRACTS).namespaces).toStrictEqual({});
  });

  it("lists a package once when it publishes a namespace in two languages", () => {
    const api = apiOf([
      catalogue("time-off", "@acme/time-off"),
      catalogue("time-off", "@acme/time-off", "nl"),
    ]);

    expect(wordsOf(api, CONTRACTS).namespaces).toStrictEqual({ "time-off": ["@acme/time-off"] });
  });

  it("lists every package that publishes a namespace in the order they were found", () => {
    const api = apiOf([catalogue("time-off", "@acme/time-off"), catalogue("time-off", "@acme/hr")]);

    expect(wordsOf(api, CONTRACTS).namespaces).toStrictEqual({
      "time-off": ["@acme/time-off", "@acme/hr"],
    });
  });

  it("lists the publishers of a namespace no installed plugin names", () => {
    const api = apiOf([catalogue("overlays", "@acme/overlays")]);

    expect(wordsOf(api, CONTRACTS).namespaces).toStrictEqual({ overlays: ["@acme/overlays"] });
  });

  it("names the scope to add for a contract package whose catalogues were not found", () => {
    expect(hintedFor("catalogued", "@partner/time-off-contract")).toStrictEqual([
      "@partner/time-off-contract has catalogues the i18n layer does not follow. Add @partner to the scopes of the i18n layer.",
    ]);
  });

  it("states that the catalogue plugin never follows a contract package without a scope", () => {
    expect(hintedFor("catalogued", "time-off-contract")).toStrictEqual([
      "time-off-contract has catalogues the i18n layer does not follow, because the layer follows scoped packages alone.",
    ]);
  });

  it("returns no hint for a contract package whose catalogues were found", () => {
    const found = [catalogue("time-off", "@partner/time-off-contract")];

    expect(hintedFor("catalogued", "@partner/time-off-contract", found)).toStrictEqual([]);
  });

  it("returns no hint for a contract package without catalogues", () => {
    expect(hintedFor("bare", "@partner/time-off-contract")).toStrictEqual([]);
  });
});
