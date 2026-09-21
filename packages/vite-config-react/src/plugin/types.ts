/**
 * Re-exports the types of the optional document compiler the MDX layer is written against.
 *
 * @remarks
 *   A top-level `export type` is erased at compile time, while an inline `import { type X }` still
 *   loads the package at run time. The compiler is an optional peer, so a repository that compiles
 *   no document must never load it. The MDX layer therefore imports the compiler's types from here.
 */

export type { Options as DocumentOptions } from "@mdx-js/rollup";
