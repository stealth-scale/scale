/**
 * Emits a CycloneDX bill of materials for a build, taken from the module graph and pinned against
 * the workspace lockfile.
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
 * Output path for the document when the caller names none, relative to the output directory.
 */
const AT = "cyclonedx/bom.json";

/**
 * The organisation that supplied the build a document describes.
 *
 * @remarks
 *   CycloneDX records a supplier on the document's metadata, not on each component. This says who
 *   produced the build and nothing about any package inside it.
 */
export interface Supplier {
  /**
   * The organisation's name, written into the document verbatim.
   */
  name: string;

  /**
   * Addresses a consumer can reach the organisation at.
   */
  url: readonly string[];
}

/**
 * The parts of the document the caller decides. The build supplies the rest.
 *
 * @remarks
 *   No field is inferred from another. The serial number and the timestamp are separate options
 *   because a reproducible release usually wants the first and not the second.
 */
export interface Described {
  /**
   * Paths the document is emitted at, relative to the output directory.
   */
  paths?: readonly string[];

  /**
   * Whether to record a random URN identifying this one build.
   */
  serialNumber?: boolean;

  /**
   * Who supplied the build. Left out of the document entirely when unset.
   */
  supplier?: Supplier;

  /**
   * Whether to record the moment the document was written.
   */
  timestamp?: boolean;

  /**
   * Whether the subject is deployed or installed. A subject with no type is a library.
   */
  type?: "application" | "library";
}

/**
 * Validates an SPDX licence expression by throwing on anything the parser rejects.
 *
 * @remarks
 *   The CycloneDX licence factory treats a thrown error as a rejection and records the declared
 *   licence as a plain name instead. A validator returning false would be read as valid.
 * @throws {@link Error} When the text is not a licence expression SPDX defines.
 */
function expression(held: string): void {
  parse(held);
}

/**
 * Constructs the builder that turns a package manifest into a CycloneDX component.
 *
 * @remarks
 *   One builder serves every component in the document. Its licence and external-reference
 *   factories decide how a manifest's fields are read.
 * @returns A builder that reads a manifest in the shape npm writes one.
 */
function building(): Contrib.FromNodePackageJson.Builders.ComponentBuilder {
  return new Contrib.FromNodePackageJson.Builders.ComponentBuilder(
    new Contrib.FromNodePackageJson.Factories.ExternalReferenceFactory(),
    new Contrib.License.Factories.LicenseFactory(expression),
  );
}

/**
 * Finds where a package was fetched from, among the fields an installer leaves in its manifest.
 *
 * @remarks
 *   The fields are tried in order and the first one present wins. npm writes `_resolved`, yarn
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
 * Strips credentials and the query string from a provenance URL.
 *
 * @remarks
 *   An installer records the address it fetched from verbatim, and a private registry takes a token
 *   in the userinfo or the query string. The document travels with the deployment, so the address
 *   is written without either. The fragment is kept, because a version-control address names its
 *   commit there. An address that does not parse as a URL, such as a `github:` shorthand, is
 *   returned unchanged.
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
 * Chooses the package URL qualifier that records where a package was fetched from.
 *
 * @remarks
 *   The lockfile is trusted over the manifest, because a manifest field survives a reinstall that
 *   changed the source. A plain version and the default registry each identify a package on their
 *   own, and a qualifier for either would only make the key harder for an advisory database to
 *   match.
 * @returns A single qualifier naming a version-control or repository URL, or null for a package the
 *   default registry already identifies.
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
 * Records the hash of the archive a package was installed from, when the lockfile pinned one.
 *
 * @remarks
 *   A digest the library refuses to parse leaves the component without a hash rather than failing
 *   the build.
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
 * Assigns a component its package URL and the lockfile's record of the install.
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
 * Attaches the licence files a package ships to its component, base64-encoded as evidence.
 *
 * @remarks
 *   A manifest's declared expression and the licence file shipped beside it disagree often enough
 *   that a licence review needs both. A package shipping no licence file leaves the component's
 *   evidence unset rather than present and empty.
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
 * Resolves a named tool from the described package and reads its manifest.
 *
 * @remarks
 *   Resolution starts at the described package rather than at this plugin, so a tool hoisted to the
 *   workspace root is found and a different version of it installed elsewhere is not mistaken for
 *   it.
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
 * Adds the tools that produced the build to the document's metadata.
 *
 * @remarks
 *   Vite and rolldown both report their own versions at run time, so the document records the
 *   version that ran rather than the range a manifest declared. The rest come from the described
 *   package's `devDependencies`, and one that is declared but not installed is skipped.
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
 * Sets the document's subject component and the metadata the caller asked for.
 *
 * @remarks
 *   A directory with no readable manifest still produces a document. It gets the rest of the
 *   metadata and no subject component. The lifecycle is always the build phase, because this runs
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
 * Adds a component for every package the build reached, then the dependency edges between them.
 *
 * @remarks
 *   Components go in on the first pass and edges on the second, because an edge usually points at a
 *   package the first pass has not created a component for yet. A package the builder declines to
 *   describe, such as one whose manifest declares no name, takes every edge touching it with it.
 *   Packages are matched to the lockfile by name and by the version their own manifest declares, so
 *   two installed versions of one name each get their own digest and source.
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
 *   caller asked for a serial number or a timestamp. A missing manifest or an unreadable lockfile
 *   costs the document detail, never the call.
 * @param stated - The caller's choices about the document.
 * @param bundling - The build being described, read for the module graph it reached.
 * @param at - Directory of the package being described. This is the bundler's resolved root, which
 *   under a task runner is not the working directory.
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
 *   The described directory comes from the bundler's resolved root and is never asked of the
 *   caller. Under a task runner the working directory is the workspace root, and a plugin reading
 *   it would describe the wrong package.
 * @returns A plugin that emits its assets while the bundle is generated.
 */
export function sbom(stated: Described = {}): Plugin {
  return plugin({
    name: "stealth:sbom",

    /**
     * Emits the document at every path the caller named, or at the default one.
     *
     * @remarks
     *   The build is serialised once and the same bytes go to every path, so a deployment copy and
     *   an artefact copy cannot drift apart.
     */
    writes(bundling, at) {
      const source = written(stated, bundling, at);

      for (const fileName of stated.paths ?? [AT]) {
        bundling.emitFile({ fileName, source, type: "asset" });
      }
    },
  });
}
