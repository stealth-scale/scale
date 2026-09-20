/**
 * Writes the statement that imports a page's components from their package.
 */

/**
 * Writes one import statement for the names, from the package.
 *
 * @param names - The components' names, in the order they are written.
 * @param from - The package they are imported from.
 * @returns The statement, on one line.
 */
export function importOf(names: readonly string[], from: string): string {
  return `import { ${names.join(", ")} } from "${from}";`;
}
