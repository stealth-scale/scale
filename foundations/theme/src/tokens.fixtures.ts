/**
 * Reads values out of a token tree for a specification, whichever way the tree nests them.
 */

import { type Mode } from "#contract.ts";

/**
 * Reads the value at a dotted path, unwrapping `value` where the node is a token.
 */
export function tokenAt(tree: unknown, path: string): unknown {
  let node = tree;

  for (const key of path.split(".")) {
    if (typeof node !== "object" || node === null) return undefined;

    node = Reflect.get(node, key);
  }

  return typeof node === "object" && node !== null && "value" in node
    ? Reflect.get(node, "value")
    : node;
}

/**
 * Reads the value at a dotted path in one color mode, or the single value where the token has one.
 */
export function modedAt(tree: unknown, path: string, mode: Mode): string {
  const value = tokenAt(tree, path);

  return typeof value === "object" && value !== null
    ? String(Reflect.get(value, mode))
    : String(value);
}
