/**
 * Checks every reference a contract, a manifest's code or the product makes: the installed
 * contract declares the name, the reference was made against a version the installed contract
 * admits, and a deprecated name is reported once per plugin that references it.
 *
 * @remarks
 *   A reference to a plugin that is not installed is a fault of the area that makes it, because
 *   the area decides between a problem and a warning. This check reports nothing for it. A
 *   reference inside a sample, a schema, an operation, a search validator or a condition's `plugin`
 *   is not followed: each is data of its own, and `plugin` may be a whole contract.
 */

import { KINDS, WORDS } from "#assemble.ts";
import { pluginOf } from "#identifiers.ts";
import { type Reference } from "#reference.ts";
import { isInstalled, keyOf, listed, MEMBERS, type ResolveContext } from "#resolve/context.ts";
import { type Report } from "#resolve/problem.ts";
import { isList, isRecord } from "#resolve/shape.ts";
import { below, compatible, isVersion } from "#version.ts";

/**
 * Members whose values are data of their own, which the walk does not follow.
 */
const UNFOLLOWED = new Set(["config", "operation", "plugin", "sample", "schema", "search"]);

/**
 * Describes one reference the walk found.
 */
interface Found {
  /**
   * Id of the plugin that makes the reference, or `product`.
   */
  readonly by: string;

  /**
   * Dotted path of the reference.
   */
  readonly path: string;

  /**
   * The reference.
   */
  readonly reference: Reference;
}

/**
 * Returns true for a reference: an object with a string id and a kind of name.
 *
 * @param value - Any value.
 */
function isReference(value: unknown): value is Reference {
  return (
    isRecord(value) &&
    typeof value["id"] === "string" &&
    KINDS.some((kind) => kind === value["kind"])
  );
}

/**
 * Collects every reference under a value, without following a reference's own members.
 *
 * @param value - The value walked.
 * @param path - Its path.
 * @param by - The plugin that makes the references, or `product`.
 * @param found - The list each reference goes into.
 */
function walk(value: unknown, path: string, by: string, found: Found[]): void {
  if (isList(value)) {
    for (const [index, item] of value.entries()) walk(item, `${path}.${String(index)}`, by, found);
  } else if (isReference(value)) {
    found.push({ by, path, reference: value });
  } else if (isRecord(value)) {
    for (const [name, member] of Object.entries(value)) {
      if (!UNFOLLOWED.has(name)) walk(member, `${path}.${name}`, by, found);
    }
  }
}

/**
 * Collects the references every installed contract, every manifest's code and the product make.
 *
 * @param context - The installed plugins, every declared name and the build's options.
 */
function referencesOf(context: ResolveContext): readonly Found[] {
  const found: Found[] = [];
  const { definition } = context;

  for (const { contract, manifest, options, pluginId } of context.installed.values()) {
    for (const { kind, name, reference } of listed(contract)) {
      for (const [member, value] of Object.entries(reference)) {
        if (!UNFOLLOWED.has(member)) {
          walk(value, `${pluginId}.${MEMBERS[kind]}.${name}.${member}`, pluginId, found);
        }
      }
    }

    walk(manifest.code.commands, `${pluginId}.code.commands`, pluginId, found);
    walk(options.when, `product.plugins.${pluginId}.when`, "product", found);
  }

  walk(definition.signIn, "product.signIn", "product", found);
  walk(definition.when, "product.when", "product", found);
  walk(definition.slots, "product.slots", "product", found);
  walk(definition.extensions, "product.extensions", "product", found);

  return found;
}

/**
 * Checks the version a reference was made against with the installed contract's version.
 *
 * @param found - The reference.
 * @param installed - The installed contract's version.
 * @param report - The report the faults go into.
 */
function checkVersion(found: Found, installed: string, report: Report): void {
  const { path, reference } = found;
  const made = reference.version;

  if (made === undefined || made === installed) return;

  if (!isVersion(made)) {
    report.problem(`${path}.version`, `is not a version: ${JSON.stringify(made)}`);

    return;
  }

  const range = `^${made.replace(/[-+].*$/u, "")}`;
  const reason = `was made against ${pluginOf(reference.id)} ${made}, and ${installed} is installed`;

  if (below(range, installed)) report.problem(path, reason);
  else if (!compatible(range, installed)) report.warning(path, reason);
}

/**
 * Checks every reference whose plugin is installed: its name, its version and its deprecation.
 *
 * @param context - The installed plugins, every declared name and the build's options.
 * @param report - The report the faults go into.
 */
export function checkReferences(context: ResolveContext, report: Report): void {
  const warned = new Set<string>();

  for (const found of referencesOf(context)) {
    const { by, path, reference } = found;
    const owner = pluginOf(reference.id);
    const word = WORDS[reference.kind];
    const declaration = context.declared.get(keyOf(reference));
    const installed = context.installed.get(owner)?.contract.version;
    const once = `${by} ${keyOf(reference)}`;

    if (!isInstalled(context, owner)) continue;

    if (declaration === undefined) {
      report.problem(path, `names the ${word} ${reference.id}, which ${owner} does not declare`);

      continue;
    }

    if (installed !== undefined) checkVersion(found, installed, report);

    if (declaration.reference.deprecated !== undefined && by !== owner && !warned.has(once)) {
      warned.add(once);
      report.warning(
        path,
        `names the deprecated ${word} ${reference.id} (${declaration.reference.deprecated})`,
      );
    }
  }
}
