/**
 * Covers what lands in a generated document, from the subject down to a single dependency edge.
 *
 * @remarks
 *   A case installs a package into a temporary workspace and hands the plugin a stand-in build
 *   whose module graph it controls, so what the document lists is decided by the case rather than
 *   by whatever this repository happens to have installed.
 */

import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { configured, generated } from "@stealthscale/testing";
import { type Bundling } from "@stealthscale/vite-plugin-base";

import { sbom, written } from "#index.ts";

/**
 * A digest with the prefix and the length a lockfile reader accepts.
 */
const INTEGRITY =
  "sha512-1CWR0Ru94zpwIHIAqbDD1zQjyjqszU0cohfGZFH7HiRtUf5ePwwQoer8MfzCiu8m+he5wL8Z/xa1NfoP+FFjnA==";

/**
 * Installs one package into a temporary workspace holding a bun lockfile.
 *
 * @param manifest - Fields added to the described package's own manifest.
 * @param dependency - The installed package's manifest. A missing one names the package and
 *   nothing else.
 * @param lockfile - The rows written between the braces of the lockfile's `packages` object.
 * @returns The described package's directory, and the module path a build would report for the
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
 * Stands in for a build whose module graph a case decides.
 *
 * @remarks
 *   Only the three members the plugin calls are provided, and emitted files are discarded. A case
 *   that needs to see what was emitted supplies its own `emitFile`.
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
 *   A path that runs out yields undefined instead of throwing, so a case asserting that the
 *   document omits something reads it the same way as one asserting a value.
 */
function field(held: unknown, ...path: readonly string[]): unknown {
  return path.reduce<unknown>(
    (one, key) => (typeof one === "object" && one !== null ? Reflect.get(one, key) : undefined),
    held,
  );
}

/**
 * Takes the one component a document lists, out of a case that installed a single package.
 */
function first(held: unknown): unknown {
  const components = field(held, "components");

  return Array.isArray(components) ? components[0] : undefined;
}

/**
 * Walks a path of keys and takes the opening entry of the list it arrives at.
 *
 * @remarks
 *   A serialised document nests several single-entry lists, such as the licences on a component.
 *   Reaching into one by index would read as a claim about ordering that no case is making.
 */
function firstOf(held: unknown, ...path: readonly string[]): unknown {
  const found = field(held, ...path);

  return Array.isArray(found) ? found[0] : undefined;
}

describe("vite-plugin-sbom", () => {
  it("describes the package it was given keyed by a package URL", () => {
    const held = document({}, workspace({ version: "1.2.3" }));

    expect(field(held, "metadata", "component", "purl")).toBe("pkg:npm/%40acme/one@1.2.3");
  });

  it("records whether the subject is deployed or installed", () => {
    const held = workspace();

    expect(field(document({ type: "application" }, held), "metadata", "component", "type")).toBe(
      "application",
    );
    expect(field(document({ type: "library" }, held), "metadata", "component", "type")).toBe(
      "library",
    );
  });

  it("records the bundler that actually ran", () => {
    const tools = field(document({}, workspace()), "metadata", "tools", "components");
    const named = Array.isArray(tools) ? tools.map((one: unknown) => field(one, "name")) : [];

    expect(named).toContain("rolldown");
    expect(named).toContain("vite");
  });

  it("lists what the build reached", () => {
    const held = workspace({}, { name: "held", version: "2.0.0" });

    expect(field(first(document({}, held, [held.module])), "purl")).toBe("pkg:npm/held@2.0.0");
  });

  it("attaches the encoded licence text a package ships", () => {
    const held = workspace({}, { name: "held", version: "2.0.0" });
    const one = firstOf(first(document({}, held, [held.module])), "evidence", "licenses");
    const text = field(one, "license", "text");
    const content = field(text, "content");

    expect(field(text, "encoding")).toBe("base64");
    expect(Buffer.from(typeof content === "string" ? content : "", "base64").toString()).toContain(
      "MIT License",
    );
  });

  it("records where a package came from when it is not the default registry", () => {
    const held = workspace(
      {},
      { name: "held", version: "2.0.0" },
      `    "held": ["held@github:acme/held#abc", {}, "acme", "${INTEGRITY}"],`,
    );
    const one = first(document({}, held, [held.module]));

    expect(field(one, "purl")).toContain("vcs_url=github");
    expect(field(firstOf(one, "hashes"), "alg")).toBe("SHA-512");
  });

  it("ignores an integrity it cannot read rather than failing the build", () => {
    const held = workspace(
      {},
      { name: "held", version: "2.0.0" },
      '    "held": ["held@2.0.0", "", {}, "sha512-tooshort"],',
    );

    expect(field(first(document({}, held, [held.module])), "hashes")).toBeUndefined();
  });

  it("records nothing extra for a package from the default registry", () => {
    const held = workspace(
      {},
      { name: "held", version: "2.0.0" },
      `    "held": ["held@2.0.0", "", {}, "${INTEGRITY}"],`,
    );

    expect(field(first(document({}, held, [held.module])), "purl")).toBe("pkg:npm/held@2.0.0");
  });

  it("includes an identity only when one was asked for", () => {
    const held = workspace();

    expect(field(document({ serialNumber: true }, held), "serialNumber")).toContain("urn:uuid:");
    expect(field(document({}, held), "serialNumber")).toBeUndefined();
    expect(field(document({ timestamp: true }, held), "metadata", "timestamp")).toBeDefined();
    expect(field(document({}, held), "metadata", "timestamp")).toBeUndefined();
  });

  it("names the supplier when one was given", () => {
    const stated = { supplier: { name: "Acme", url: ["https://acme.test"] } };

    expect(field(document(stated, workspace()), "metadata", "supplier", "name")).toBe("Acme");
  });

  it("writes one copy by default and every path it was given", async () => {
    const held = workspace();
    const emitted: string[] = [];
    const bundling = {
      emitFile: (one: { fileName: string }): void => void emitted.push(one.fileName),
      getModuleIds: (): string[] => [],
      getModuleInfo: (): { importedIds: string[] } => ({ importedIds: [] }),
    };

    const run = async (paths?: readonly string[]): Promise<void> => {
      const one = sbom(paths === undefined ? {} : { paths });

      await configured(one, { root: held.at });
      await generated(one, bundling);
    };

    await run();

    expect(emitted).toStrictEqual(["cyclonedx/bom.json"]);

    emitted.length = 0;
    await run(["a.json", "b.json"]);

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

  it("draws an edge between two packages the build reached", () => {
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

  it("reads a licence the manifest declares beside its text", () => {
    const held = workspace({}, { license: "MIT", name: "held", version: "2.0.0" });
    const one = firstOf(first(document({}, held, [held.module])), "licenses");

    expect(field(one, "license", "id")).toBe("MIT");
  });

  it("reads a compound licence as the expression it is", () => {
    const held = workspace({}, { license: "(MIT OR Apache-2.0)", name: "held", version: "2.0.0" });
    const one = firstOf(first(document({}, held, [held.module])), "licenses");

    expect(field(one, "expression")).toBe("(MIT OR Apache-2.0)");
  });

  it("writes a document even when the package has no manifest", () => {
    const root = mkdtempSync(join(tmpdir(), "stealth-sbom-"));
    const held = JSON.parse(written({}, building(), root)) as unknown;

    expect(field(held, "metadata", "component")).toBeUndefined();
    expect(field(held, "bomFormat")).toBe("CycloneDX");
  });

  it("names a package that declares no version", () => {
    const held = workspace({}, { name: "held" });

    expect(field(first(document({}, held, [held.module])), "purl")).toBe("pkg:npm/held");
  });

  it("reads where a package came from when the manager wrote it into the package", () => {
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

  it("ignores a package the builder will not describe and any edge to it", () => {
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

  it("reads the tarball a registry install recorded when it is the only record", () => {
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

  it("writes where a package came from without the credential and the query it was fetched with", () => {
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

  it("writes a source that is no URL as it was", () => {
    const held = workspace(
      {},
      { _resolved: "../vendor/held-2.0.0.tgz", name: "held", version: "2.0.0" },
    );
    const purl = field(first(document({}, held, [held.module])), "purl");
    const spelled = typeof purl === "string" ? decodeURIComponent(purl) : "";

    expect(spelled).toContain("repository_url=../vendor/held-2.0.0.tgz");
  });

  it("keeps the commit a version control address names after the hash", () => {
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

  it("pins each of two installed versions of one name to its own record", () => {
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
