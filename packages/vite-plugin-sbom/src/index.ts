/**
 * Writes a CycloneDX bill of materials listing what a build actually put into its bundle, read from
 * the module graph rather than from any manifest and pinned against the lockfile.
 *
 * @packageDocumentation
 */

import { Contrib, Enums, Models, Serialize, Spec } from "@cyclonedx/cyclonedx-library";
import { createRequire } from "node:module";
import { dirname } from "node:path";
import { PackageURL } from "packageurl-js";
import parse from "spdx-expression-parse";
import { rolldownVersion, version } from "vite";

import {
  type Bundling,
  type Installed,
  installedOf,
  licensed,
  locked,
  type Manifest,
  manifestAt,
  type Plugin,
  plugin,
  type Reached,
  reached,
  text,
} from "@stealthscale/vite-plugin-base";

/**
 * The path the document is written to when a caller names none.
 */
const AT = "cyclonedx/bom.json";

/**
 * The organisation a document names as having supplied the thing it describes.
 *
 * @remarks
 *   CycloneDX carries a supplier on the document's metadata rather than on each component, so this
 *   describes whoever produced the build and says nothing about any package inside it.
 */
export interface Supplier {
  /**
   * The organisation's name, written into the document as given.
   */
  name: string;

  /**
   * Each address a consumer can reach the organisation at.
   */
  url: readonly string[];
}

/**
 * Fixes what a caller decides about the document, leaving the rest to the build.
 *
 * @remarks
 *   No field is inferred from another. An identity and a clock reading are asked for separately
 *   because a reproducible release often wants the first without the second.
 */
export interface Described {
  /**
   * Each path the document is emitted at, relative to the output directory.
   */
  paths?: readonly string[];

  /**
   * Whether the document carries a random URN naming this one build.
   */
  serialNumber?: boolean;

  /**
   * Who supplied the build. An absent supplier is left out of the document entirely.
   */
  supplier?: Supplier;

  /**
   * Whether the document records the moment it was written.
   */
  timestamp?: boolean;

  /**
   * Whether the subject is deployed or installed. A subject with no type is a library.
   */
  type?: "application" | "library";
}

/**
 * Rejects an SPDX expression the parser refuses.
 *
 * @remarks
 *   The licence factory reads a thrown error as its answer, and falls back to recording the
 *   declared licence as a name. A validator that returned a boolean would be read as valid.
 * @throws {@link Error} When the text is not a licence expression SPDX defines.
 */
function expression(held: string): void {
  parse(held);
}

/**
 * Assembles the builder that turns a package manifest into a component.
 *
 * @remarks
 *   One builder serves every component in a document, and holds the licence and external reference
 *   factories that decide how a manifest's fields are read.
 * @returns A builder that reads a manifest in the shape npm writes one.
 */
function building(): Contrib.FromNodePackageJson.Builders.ComponentBuilder {
  return new Contrib.FromNodePackageJson.Builders.ComponentBuilder(
    new Contrib.FromNodePackageJson.Factories.ExternalReferenceFactory(),
    new Contrib.License.Factories.LicenseFactory(expression),
  );
}

/**
 * Finds where a package came from, among the fields an installer leaves behind in its manifest.
 *
 * @remarks
 *   Each field is read in turn and the first one present answers. npm writes `_resolved`, yarn
 *   writes `resolved`, and a plain registry install may leave nothing but the tarball under `dist`.
 *   bun writes none of the three, which is why the lockfile is read as well.
 */
function installedFrom(manifest: Manifest): string | undefined {
  const dist = manifest["dist"];
  const tarball =
    typeof dist === "object" && dist !== null
      ? text(Object.fromEntries(Object.entries(dist)), "tarball")
      : undefined;

  return text(manifest, "_resolved") ?? text(manifest, "resolved") ?? tarball;
}

/**
 * Strips what a provenance URL carries that identifies nobody's package: a credential in front of
 * the host, and every query parameter after the path.
 *
 * @remarks
 *   An installer writes the address it fetched from as it was given, and a private registry is
 *   given a token in the address or after the question mark. The document is read by whoever reads
 *   the deployment, so the address is written without either. The fragment is kept, because a
 *   version control address names its commit there. An address that is no URL, such as a `github:`
 *   shorthand, is written as it was.
 */
function sanitized(held: string): string {
  let url: URL;

  try {
    url = new URL(held);
  } catch {
    return held;
  }

  url.username = "";
  url.password = "";
  url.search = "";

  return url.href;
}

/**
 * Decides the package URL qualifier that records where a package was fetched from.
 *
 * @remarks
 *   The lockfile is trusted over the manifest, because a manifest field survives a reinstall that
 *   changed the source. A plain version and the default registry each identify a package on their
 *   own, and a qualifier for either would only make the key an advisory database matches on harder
 *   to match.
 * @returns A single qualifier naming a version control or a repository URL, or null for a package
 *   the default registry already identifies.
 */
function qualifiers(manifest: Manifest, installed?: Installed): null | Record<string, string> {
  const held = installed?.registry ?? installed?.resolution ?? installedFrom(manifest);

  if (
    held === undefined ||
    /^\d/u.test(held) ||
    Contrib.FromNodePackageJson.Utils.defaultRegistryMatcher.test(held)
  ) {
    return null;
  }

  return /^(?:git[+:]|ssh:|github:|gitlab:|bitbucket:)|\.git(?:#|$)/u.test(held)
    ? { vcs_url: sanitized(held) }
    : { repository_url: sanitized(held) };
}

/**
 * Sets the hash of the archive a package was installed from, where the lockfile pinned one.
 *
 * @remarks
 *   A digest the library refuses to split leaves the component without a hash and does not stop the
 *   build. A hash nobody can read is worth less than the document it would otherwise cost.
 */
function verified(component: Models.Component, installed?: Installed): void {
  if (installed?.integrity === undefined) return;

  try {
    const [algorithm, value] = Contrib.FromNodePackageJson.Utils.parsePackageIntegrity(
      installed.integrity,
    );

    component.hashes.set(algorithm, value);
  } catch {}
}

/**
 * Keys a component by its package URL and pins it to what the lockfile says was installed.
 *
 * @remarks
 *   The same URL becomes the component's `bom-ref`, so a dependency edge points at the string an
 *   advisory database keys on rather than at a reference only this document understands.
 */
function identify(component: Models.Component, manifest: Manifest, installed?: Installed): void {
  const url = new PackageURL(
    "npm",
    component.group ?? null,
    component.name,
    component.version ?? null,
    qualifiers(manifest, installed),
    null,
  ).toString();

  component.purl = url;
  component.bomRef.value = url;
  verified(component, installed);
}

/**
 * Attaches the licence files shipped in a package as base64 evidence on its component.
 *
 * @remarks
 *   A manifest's declared expression and the text beside it disagree often enough that a licence
 *   review needs to read both. A directory shipping no licence file leaves the component's evidence
 *   unset rather than present and empty.
 */
function evidence(component: Models.Component, at: string): void {
  const held = licensed(at);

  if (held.length === 0) return;

  const found = new Models.ComponentEvidence();

  for (const one of held) {
    const license = new Models.NamedLicense(`file: ${one.named}`);

    license.text = new Models.Attachment(Buffer.from(one.text, "utf8").toString("base64"), {
      contentType: "text/plain",
      encoding: Enums.AttachmentEncoding.Base64,
    });

    found.licenses.add(license);
  }

  component.evidence = found;
}

/**
 * Locates the manifest of a named tool as it resolves from the described package.
 *
 * @remarks
 *   Resolution starts at the described package rather than at this plugin, so a tool hoisted to the
 *   workspace root is found and a tool declared under a different version elsewhere is not
 *   mistaken for it.
 * @returns The tool's manifest, or undefined when nothing resolves under that name.
 */
function toolAt(at: string, named: string): Manifest | undefined {
  try {
    return manifestAt(dirname(createRequire(`${at}/`).resolve(`${named}/package.json`)));
  } catch {
    return undefined;
  }
}

/**
 * Records the tools that produced the build on the document's metadata.
 *
 * @remarks
 *   Both vite and rolldown report their own versions at run time, so what is written is what ran
 *   rather than what a manifest asked for. The rest come from the described package's
 *   `devDependencies`, and one that is declared but not installed is passed over silently.
 */
function toolchain(
  bom: Models.Bom,
  at: string,
  components: Contrib.FromNodePackageJson.Builders.ComponentBuilder,
  installed: ReadonlyMap<string, Installed>,
): void {
  bom.metadata.tools.components.add(
    new Models.Component(Enums.ComponentType.Application, "vite", { version }),
  );
  bom.metadata.tools.components.add(
    new Models.Component(Enums.ComponentType.Application, "rolldown", {
      version: rolldownVersion,
    }),
  );

  const declared = manifestAt(at)?.["devDependencies"];
  const names = typeof declared === "object" && declared !== null ? Object.keys(declared) : [];

  for (const named of names) {
    const manifest = toolAt(at, named);
    const held = manifest === undefined ? undefined : components.makeComponent(manifest);

    if (held !== undefined && manifest !== undefined) {
      identify(held, manifest, installedOf(installed, named, text(manifest, "version")));
      bom.metadata.tools.components.add(held);
    }
  }
}

/**
 * Puts the subject of the document, and everything asked about it, on the metadata.
 *
 * @remarks
 *   A directory with no readable manifest still produces a document: it gets the rest of the
 *   metadata and no subject component. The lifecycle is always the build phase, since this runs
 *   inside the build that produced the artefact being described.
 */
function described(
  bom: Models.Bom,
  stated: Described,
  at: string,
  components: Contrib.FromNodePackageJson.Builders.ComponentBuilder,
): void {
  const manifest = manifestAt(at) ?? {};
  const root = components.makeComponent(
    manifest,
    stated.type === "application" ? Enums.ComponentType.Application : Enums.ComponentType.Library,
  );

  if (root !== undefined) {
    identify(root, manifest);
    evidence(root, at);
    bom.metadata.component = root;
  }

  bom.metadata.lifecycles.add(Enums.LifecyclePhase.Build);

  if (stated.supplier !== undefined) {
    bom.metadata.supplier = new Models.OrganizationalEntity({
      name: stated.supplier.name,
      url: new Set(stated.supplier.url),
    });
  }

  if (stated.timestamp === true) bom.metadata.timestamp = new Date();
  if (stated.serialNumber === true) bom.serialNumber = Contrib.Bom.Utils.randomSerialNumber();
}

/**
 * Lists every package the build reached, then draws the edges the module graph showed between them.
 *
 * @remarks
 *   Components go in on the first pass and edges on the second, because an edge often points at a
 *   package the first pass has not created a component for yet. A package the builder declines to
 *   describe, such as one whose manifest names nothing, takes every edge touching it with it. Each
 *   package is matched to the lockfile by its name and the version its own manifest states, so two
 *   installed versions of one name each get their own digest and source.
 */
function inventory(
  bom: Models.Bom,
  found: ReadonlyMap<string, Reached>,
  components: Contrib.FromNodePackageJson.Builders.ComponentBuilder,
  installed: ReadonlyMap<string, Installed>,
): void {
  const made = new Map<string, Models.Component>();

  for (const [at, one] of found) {
    const held = components.makeComponent(one.manifest, Enums.ComponentType.Library);

    if (held === undefined) continue;

    identify(held, one.manifest, installedOf(installed, one.named, text(one.manifest, "version")));
    evidence(held, at);
    made.set(at, held);
    bom.components.add(held);
  }

  for (const [at, one] of found) {
    const from = made.get(at);

    for (const to of one.dependsOn) {
      const target = made.get(to);

      if (from !== undefined && target !== undefined) from.dependencies.add(target.bomRef);
    }
  }
}

/**
 * Serialises the bill of materials for one build as CycloneDX 1.7 JSON.
 *
 * @remarks
 *   Every list in the document is sorted, so the same inputs serialise to the same bytes unless the
 *   caller asked for a serial number or a timestamp. A build is described whole or not at all: a
 *   missing manifest or an unreadable lockfile costs the document detail, never the call.
 * @param stated - The choices the caller settled about the document.
 * @param bundling - The build being described, read for the module graph it reached.
 * @param at - The directory of the package being described. This is the bundler's resolved root,
 *   which under a task runner is not the working directory.
 * @returns The serialised document.
 */
export function written(stated: Described, bundling: Bundling, at: string): string {
  const components = building();
  const bom = new Models.Bom();
  const installed = locked(at);

  described(bom, stated, at, components);
  toolchain(bom, at, components, installed);
  inventory(bom, reached(bundling), components, installed);

  return new Serialize.JsonSerializer(
    new Serialize.JSON.Normalize.Factory(Spec.Spec1dot7),
  ).serialize(bom, { sortLists: true });
}

/**
 * Builds the plugin that emits a bill of materials alongside the bundle.
 *
 * @remarks
 *   The described directory is taken from the bundler's resolved root and is never asked of the
 *   caller, because under a task runner the working directory is the workspace root and a plugin
 *   reading it would describe the wrong package.
 * @returns A plugin that emits its assets while the bundle is generated.
 */
export function sbom(stated: Described = {}): Plugin {
  return plugin({
    name: "stealth:sbom",

    /**
     * Emits the document at every path the caller named, or at the default one.
     *
     * @remarks
     *   The build is serialised once and the same bytes go to each path, so a deployment copy and
     *   the artefact copy can never drift apart.
     */
    writes(bundling, at) {
      const source = written(stated, bundling, at);

      for (const fileName of stated.paths ?? [AT]) {
        bundling.emitFile({ fileName, source, type: "asset" });
      }
    },
  });
}
