/**
 * Reads the page a specimen module declares, without trusting the module to have declared one.
 */

import { type Scene, type Specimen } from "#page.ts";

/**
 * Returns true when a value is a scene the catalogue can draw.
 */
function isScene(value: unknown): value is Scene {
  if (typeof value !== "object" || value === null) return false;

  return (
    typeof Reflect.get(value, "draw") === "function" &&
    typeof Reflect.get(value, "title") === "string"
  );
}

/**
 * Returns the page a loaded specimen module declares, or undefined where it declares none.
 *
 * @remarks
 *   The index types a loader as returning `unknown`, because the plugin parses a specimen rather
 *   than evaluating it and so never sees what the module exports. The check is here instead, where
 *   a page that fails it is drawn as broken rather than thrown.
 */
export function declared(module: unknown): Specimen | undefined {
  if (typeof module !== "object" || module === null) return undefined;

  const page: unknown = Reflect.get(module, "default");

  if (typeof page !== "object" || page === null) return undefined;

  const scenes: unknown = Reflect.get(page, "scenes");
  const id: unknown = Reflect.get(page, "id");
  const imports: unknown = Reflect.get(page, "imports");

  if (typeof id !== "string" || !Array.isArray(scenes)) return undefined;
  if (!scenes.every((one: unknown) => isScene(one))) return undefined;

  return typeof imports === "string" ? { id, imports, scenes } : { id, scenes };
}
