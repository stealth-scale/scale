/**
 * Covers what ends up in a generated document, from the subject component down to a single
 * dependency edge.
 *
 * @remarks
 *   Each case installs a package into a temporary workspace and hands the plugin a stand-in build
 *   whose module graph the case controls, so the document's contents are decided by the case
 *   rather than by whatever this repository happens to have installed.
 */

import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { configured, generated } from "@stealthscale/testing";
import { type Bundling } from "@stealthscale/vite-plugin-base";

import { sbom, written } from "#index.ts";

/**
 * A digest carrying the prefix and the length a lockfile reader accepts.
 */
const INTEGRITY =
  "sha512-1CWR0Ru94zpwIHIAqbDD1zQjyjqszU0cohfGZFH7HiRtUf5ePwwQoer8MfzCiu8m+he5wL8Z/xa1NfoP+FFjnA==";

/**
 * Installs one package into a fresh temporary workspace holding a bun lockfile.
 *
 * @param manifest - Fields merged into the subject package's own manifest.
 * @param dependency - The installed package's manifest. Left out, it names the package and nothing
 *   else.
 * @param lockfile - The rows written between the braces of the lockfile's `packages` object.
 * @returns The subject package's directory, and the module path a build would report for the
 *   installed package.
 */
function workspace(
  manifest: Record<string, unknown> = {},
  dependency?: Record<string, unknown>,
  lockfile = "",
): { readonly at: string; readonly module: string } {
  const root = mkdtempSync(join(tmpdir(), "stealth-sbom-"));
  const at = join(root, "packages", "one");
  const held = join(root, "node_modules", "held");

  mkdirSync(at, { recursive: true });
  writeFileSync(join(at, "package.json"), JSON.stringify({ name: "@acme/one", ...manifest }));
  writeFileSync(join(root, "bun.lock"), `{\n  "packages": {\n${lockfile}\n  },\n}\n`);

  mkdirSync(held, { recursive: true });
  writeFileSync(join(held, "package.json"), JSON.stringify(dependency ?? { name: "held" }));
  writeFileSync(join(held, "index.js"), "");
  writeFileSync(join(held, "LICENSE"), "MIT License\n");

  return { at, module: join(held, "index.js") };
}

/**
 * Stands in for a build whose module graph the case decides.
 *
 * @remarks
 *   Only the three members the plugin actually calls are implemented, and emitted files are
 *   thrown away. A case that needs to see what was emitted passes its own `emitFile`.
 */
function building(
  modules: readonly string[] = [],
  imports: Readonly<Record<string, readonly string[]>> = {},
): Bundling {
  return {
    emitFile: () => "",
    getModuleIds: () => modules,
    getModuleInfo: (id: string) => ({ importedIds: imports[id] ?? [] }),
  } as unknown as Bundling;
}

/**
 * Generates a document for a prepared workspace and parses it back.
 *
 * @returns The document as plain data, which a case reads with {@link field}.
 * @throws {@link SyntaxError} When the plugin writes something that is not JSON.
 */
function document(
  stated: Parameters<typeof written>[0],
  held: ReturnType<typeof workspace>,
  modules: readonly string[] = [],
  imports: Readonly<Record<string, readonly string[]>> = {},
): unknown {
  return JSON.parse(written(stated, building(modules, imports), held.at));
}

/**
 * Walks a path of keys into parsed data, stopping at the first key that leads nowhere.
 *
 * @remarks
 *   A path that runs out returns undefined rather than throwing, so a case asserting the document
 *   omits something reads it exactly the same way as one asserting a value.
 */
function field(held: unknown, ...path: readonly string[]): unknown {
  return path.reduce<unknown>(
    (one, key) => (typeof one === "object" && one !== null ? Reflect.get(one, key) : undefined),
    held,
  );
}

/**
 * Returns the first component a document lists, which is the only one when the case installed a
 * single package.
 */
function first(held: unknown): unknown {
  const components = field(held, "components");

  return Array.isArray(components) ? components[0] : undefined;
}

/**
 * Walks a path of keys and returns the first entry of the list it arrives at.
 *
 * @remarks
 *   A serialised document nests several single-entry lists, such as the licences on a component.
 *   Indexing into one at the call site would read as a claim about ordering that no case makes.
 */
function firstOf(held: unknown, ...path: readonly string[]): unknown {
  const found = field(held, ...path);

  return Array.isArray(found) ? found[0] : undefined;
}

describe("vite-plugin-sbom", () => {
  it("percent-encodes the scope in the subject component's package URL", () => {
    const held = document({}, workspace({ version: "1.2.3" }));

    expect(field(held, "metadata", "component", "purl")).toBe("pkg:npm/%40acme/one@1.2.3");
  });

  it("writes the component type the caller passed", () => {
    const held = workspace();

    expect(field(document({ type: "application" }, held), "metadata", "component", "type")).toBe(
      "application",
    );
    expect(field(document({ type: "library" }, held), "metadata", "component", "type")).toBe(
      "library",
    );
  });

  it("records rolldown and vite among the tools that ran", () => {
    const tools = field(document({}, workspace()), "metadata", "tools", "components");
    const named = Array.isArray(tools) ? tools.map((one: unknown) => field(one, "name")) : [];

    expect(named).toContain("rolldown");
    expect(named).toContain("vite");
  });

  it("lists a component for a package the build reached", () => {
    const held = workspace({}, { name: "held", version: "2.0.0" });

    expect(field(first(document({}, held, [held.module])), "purl")).toBe("pkg:npm/held@2.0.0");
  });

  it("attaches the licence file a package ships as base64 evidence", () => {
    const held = workspace({}, { name: "held", version: "2.0.0" });
    const one = firstOf(first(document({}, held, [held.module])), "evidence", "licenses");
    const text = field(one, "license", "text");
    const content = field(text, "content");

    expect(field(text, "encoding")).toBe("base64");
    expect(Buffer.from(typeof content === "string" ? content : "", "base64").toString()).toContain(
      "MIT License",
    );
  });

  it("records a vcs_url qualifier for a package fetched from a git remote", () => {
    const held = workspace(
      {},
      { name: "held", version: "2.0.0" },
      `    "held": ["held@github:acme/held#abc", {}, "acme", "${INTEGRITY}"],`,
    );

    expect(field(first(document({}, held, [held.module])), "purl")).toContain("vcs_url=github");
  });

  it("records SHA-512 as the algorithm of the digest the lockfile pinned", () => {
    const held = workspace(
      {},
      { name: "held", version: "2.0.0" },
      `    "held": ["held@github:acme/held#abc", {}, "acme", "${INTEGRITY}"],`,
    );
    const one = first(document({}, held, [held.module]));

    expect(field(firstOf(one, "hashes"), "alg")).toBe("SHA-512");
  });

  it("omits the hash when the lockfile digest does not parse", () => {
    const held = workspace(
      {},
      { name: "held", version: "2.0.0" },
      '    "held": ["held@2.0.0", "", {}, "sha512-tooshort"],',
    );

    expect(field(first(document({}, held, [held.module])), "hashes")).toBeUndefined();
  });

  it("writes a bare package URL for a package from the default registry", () => {
    const held = workspace(
      {},
      { name: "held", version: "2.0.0" },
      `    "held": ["held@2.0.0", "", {}, "${INTEGRITY}"],`,
    );

    expect(field(first(document({}, held, [held.module])), "purl")).toBe("pkg:npm/held@2.0.0");
  });

  it("writes a serial number only when the caller asks for one", () => {
    const held = workspace();

    expect(field(document({ serialNumber: true }, held), "serialNumber")).toContain("urn:uuid:");
    expect(field(document({}, held), "serialNumber")).toBeUndefined();
  });

  it("writes a timestamp only when the caller asks for one", () => {
    const held = workspace();

    expect(field(document({ timestamp: true }, held), "metadata", "timestamp")).toBeDefined();
    expect(field(document({}, held), "metadata", "timestamp")).toBeUndefined();
  });

  it("writes the supplier the caller passed", () => {
    const stated = { supplier: { name: "Acme", url: ["https://acme.test"] } };

    expect(field(document(stated, workspace()), "metadata", "supplier", "name")).toBe("Acme");
  });

  it("emits the document at cyclonedx/bom.json when the caller names no path", async () => {
    const held = workspace();
    const emitted: string[] = [];
    const bundling = {
      emitFile: (one: { fileName: string }): void => void emitted.push(one.fileName),
      getModuleIds: (): string[] => [],
      getModuleInfo: (): { importedIds: string[] } => ({ importedIds: [] }),
    };
    const one = sbom();

    await configured(one, { root: held.at });
    await generated(one, bundling);

    expect(emitted).toStrictEqual(["cyclonedx/bom.json"]);
  });

  it("emits the document at every path the caller named", async () => {
    const held = workspace();
    const emitted: string[] = [];
    const bundling = {
      emitFile: (one: { fileName: string }): void => void emitted.push(one.fileName),
      getModuleIds: (): string[] => [],
      getModuleInfo: (): { importedIds: string[] } => ({ importedIds: [] }),
    };
    const one = sbom({ paths: ["a.json", "b.json"] });

    await configured(one, { root: held.at });
    await generated(one, bundling);

    expect(emitted).toStrictEqual(["a.json", "b.json"]);
  });

  it("records the tools the package declares it is built with", () => {
    const held = workspace({ devDependencies: { held: "1" } }, { name: "held", version: "2.0.0" });
    const tools = field(document({}, held), "metadata", "tools", "components");
    const named = Array.isArray(tools) ? tools.map((one: unknown) => field(one, "name")) : [];

    expect(named).toContain("held");
  });

  it("ignores a declared tool that is not installed", () => {
    const held = workspace({ devDependencies: { nowhere: "1" } });
    const tools = field(document({}, held), "metadata", "tools", "components");
    const named = Array.isArray(tools) ? tools.map((one: unknown) => field(one, "name")) : [];

    expect(named).not.toContain("nowhere");
  });

  it("records a dependency edge between two packages the build reached", () => {
    const root = mkdtempSync(join(tmpdir(), "stealth-sbom-"));
    const at = join(root, "packages", "one");
    const paths = ["held", "deeper"].map((named) => join(root, "node_modules", named));

    mkdirSync(at, { recursive: true });
    writeFileSync(join(at, "package.json"), JSON.stringify({ name: "@acme/one" }));
    writeFileSync(join(root, "bun.lock"), '{\n  "packages": {\n  },\n}\n');

    for (const [index, one] of paths.entries()) {
      mkdirSync(one, { recursive: true });
      writeFileSync(
        join(one, "package.json"),
        JSON.stringify({ name: index === 0 ? "held" : "deeper", version: "1.0.0" }),
      );
      writeFileSync(join(one, "index.js"), "");
    }

    const modules = paths.map((one) => join(one, "index.js"));
    const held = JSON.parse(
      written({}, building(modules, { [modules[0] ?? ""]: [modules[1] ?? ""] }), at),
    ) as unknown;
    const edges = field(held, "dependencies");
    const drawn = Array.isArray(edges)
      ? edges.filter((one: unknown) => field(one, "dependsOn") !== undefined)
      : [];

    expect(drawn).toHaveLength(1);
    expect(field(drawn[0], "ref")).toBe("pkg:npm/held@1.0.0");
  });

  it("records the licence id a manifest declares", () => {
    const held = workspace({}, { license: "MIT", name: "held", version: "2.0.0" });
    const one = firstOf(first(document({}, held, [held.module])), "licenses");

    expect(field(one, "license", "id")).toBe("MIT");
  });

  it("records a compound licence as an SPDX expression", () => {
    const held = workspace({}, { license: "(MIT OR Apache-2.0)", name: "held", version: "2.0.0" });
    const one = firstOf(first(document({}, held, [held.module])), "licenses");

    expect(field(one, "expression")).toBe("(MIT OR Apache-2.0)");
  });

  it("writes a document with no subject component when the package has no manifest", () => {
    const root = mkdtempSync(join(tmpdir(), "stealth-sbom-"));
    const held = JSON.parse(written({}, building(), root)) as unknown;

    expect(field(held, "metadata", "component")).toBeUndefined();
    expect(field(held, "bomFormat")).toBe("CycloneDX");
  });

  it("writes a package URL without a version when the manifest declares none", () => {
    const held = workspace({}, { name: "held" });

    expect(field(first(document({}, held, [held.module])), "purl")).toBe("pkg:npm/held");
  });

  it("records a repository_url qualifier from the manifest's _resolved field", () => {
    const held = workspace(
      {},
      {
        _resolved: "https://npm.acme.test/held/-/held-2.0.0.tgz",
        name: "held",
        version: "2.0.0",
      },
    );

    expect(field(first(document({}, held, [held.module])), "purl")).toContain("repository_url=");
  });

  it("skips a package whose manifest declares no name", () => {
    const root = mkdtempSync(join(tmpdir(), "stealth-sbom-"));
    const at = join(root, "packages", "one");
    const paths = ["held", "nameless"].map((named) => join(root, "node_modules", named));

    mkdirSync(at, { recursive: true });
    writeFileSync(join(at, "package.json"), JSON.stringify({ name: "@acme/one" }));
    writeFileSync(join(root, "bun.lock"), '{\n  "packages": {\n  },\n}\n');

    for (const [index, one] of paths.entries()) {
      mkdirSync(one, { recursive: true });
      writeFileSync(
        join(one, "package.json"),
        JSON.stringify({ name: index === 0 ? "held" : "", version: "1.0.0" }),
      );
      writeFileSync(join(one, "index.js"), "");
    }

    const modules = paths.map((one) => join(one, "index.js"));
    const held = JSON.parse(
      written({}, building(modules, { [modules[0] ?? ""]: [modules[1] ?? ""] }), at),
    ) as unknown;
    const components = field(held, "components");

    expect(Array.isArray(components) ? components.length : 0).toBe(1);
    expect(field(first(held), "dependencies")).toBeUndefined();
  });

  it("records a repository_url qualifier from the manifest's dist tarball", () => {
    const held = workspace(
      {},
      {
        dist: { tarball: "https://npm.acme.test/held/-/held-2.0.0.tgz" },
        name: "held",
        version: "2.0.0",
      },
    );

    expect(field(first(document({}, held, [held.module])), "purl")).toContain("repository_url=");
  });

  it("writes a recorded source without its credential or its query string", () => {
    const held = workspace(
      {},
      {
        _resolved: "https://user:secret@npm.acme.test/held/-/held-2.0.0.tgz?token=abc&x=1",
        name: "held",
        version: "2.0.0",
      },
    );
    const purl = field(first(document({}, held, [held.module])), "purl");
    const spelled = typeof purl === "string" ? decodeURIComponent(purl) : "";

    expect(spelled).toContain("repository_url=https://npm.acme.test/held/-/held-2.0.0.tgz");
    expect(spelled).not.toContain("secret");
    expect(spelled).not.toContain("token");
  });

  it("writes a source that does not parse as a URL unchanged", () => {
    const held = workspace(
      {},
      { _resolved: "../vendor/held-2.0.0.tgz", name: "held", version: "2.0.0" },
    );
    const purl = field(first(document({}, held, [held.module])), "purl");
    const spelled = typeof purl === "string" ? decodeURIComponent(purl) : "";

    expect(spelled).toContain("repository_url=../vendor/held-2.0.0.tgz");
  });

  it("keeps the commit fragment on a version control source", () => {
    const held = workspace(
      {},
      { name: "held", version: "2.0.0" },
      `    "held": ["held@git+https://token@github.com/acme/held.git#abc123", {}, "acme", "${INTEGRITY}"],`,
    );
    const purl = field(first(document({}, held, [held.module])), "purl");
    const spelled = typeof purl === "string" ? decodeURIComponent(purl) : "";

    expect(spelled).toContain("vcs_url=git+https://github.com/acme/held.git#abc123");
    expect(spelled).not.toContain("token");
  });

  it("lists two installed versions of one name as two components", () => {
    const root = mkdtempSync(join(tmpdir(), "stealth-sbom-"));
    const at = join(root, "packages", "one");
    const older = join(root, "node_modules", "held");
    const newer = join(root, "node_modules", "other", "node_modules", "held");

    mkdirSync(at, { recursive: true });
    writeFileSync(join(at, "package.json"), JSON.stringify({ name: "@acme/one" }));
    writeFileSync(
      join(root, "bun.lock"),
      [
        "{",
        '  "packages": {',
        `    "held": ["held@1.0.0", "", {}, "${INTEGRITY}"],`,
        '    "other/held": ["held@2.0.0", "https://npm.acme.test/held/-/held-2.0.0.tgz", {}, ""],',
        "  },",
        "}",
        "",
      ].join("\n"),
    );

    for (const [directory, version] of [
      [older, "1.0.0"],
      [newer, "2.0.0"],
    ] as const) {
      mkdirSync(directory, { recursive: true });
      writeFileSync(join(directory, "package.json"), JSON.stringify({ name: "held", version }));
      writeFileSync(join(directory, "index.js"), "");
    }

    const modules = [join(older, "index.js"), join(newer, "index.js")];
    const parsed = JSON.parse(written({}, building(modules), at)) as unknown;
    const components = field(parsed, "components");
    const purls = Array.isArray(components)
      ? components
          .map((one) => String(field(one, "purl")))
          .toSorted((one, other) => one.localeCompare(other))
      : [];

    expect(purls).toStrictEqual([
      "pkg:npm/held@1.0.0",
      "pkg:npm/held@2.0.0?repository_url=https%3A%2F%2Fnpm.acme.test%2Fheld%2F-%2Fheld-2.0.0.tgz",
    ]);
  });
});
