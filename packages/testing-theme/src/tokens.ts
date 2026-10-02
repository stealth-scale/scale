/**
 * Walks a block of tokens to any depth, telling a token apart from the group that holds it.
 */

/**
 * One token a walk found, with the path that led to it.
 */
export interface Leaf {
  /**
   * The dotted path from the block to the token.
   */
  path: string;

  /**
   * The token's value: either a string, or one value per mode.
   */
  value: unknown;
}

/**
 * Reports whether a node is a token, which in this format means an object with a `value` property.
 */
export function isToken(node: unknown): node is object {
  return typeof node === "object" && node !== null && "value" in node;
}

/**
 * Lists every token under a block with its dotted path, in the order the block states them.
 *
 * @remarks
 *   Any object that is not a token counts as a group, so a palette's nested roles and a family's
 *   members are reached the same way. Anything that is neither is skipped.
 */
export function leaves(block?: unknown, prefix = ""): readonly Leaf[] {
  if (typeof block !== "object" || block === null) return [];

  return Object.entries(block).flatMap(([name, node]) => {
    const path = prefix === "" ? name : `${prefix}.${name}`;

    if (isToken(node)) return [{ path, value: Reflect.get(node, "value") }];

    return leaves(node, path);
  });
}

/**
 * Follows a dotted path into a block, or undefined where the path runs off the end of it.
 */
export function nodeAt(block: unknown, path: string): unknown {
  let node = block;

  for (const name of path.split(".")) {
    if (typeof node !== "object" || node === null) return undefined;

    node = Reflect.get(node, name);
  }

  return node;
}

/**
 * Reports whether a dotted path lands on a token, directly or through a group's DEFAULT.
 */
export function stated(block: unknown, path: string): boolean {
  const node = nodeAt(block, path);

  return isToken(node) || isToken(nodeAt(node, "DEFAULT"));
}

/**
 * Converts a file name to camel case, which is the key a recipe or an extension is registered
 * under.
 */
export function camelCased(name: string): string {
  return name.replaceAll(/-([a-z0-9])/gu, (_match, letter: string) => letter.toUpperCase());
}
