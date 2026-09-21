/**
 * Re-exports the types of the optional document compiler the MDX layer is written against.
 *
 * @remarks
 *   Gathered here because a top-level `export type` is erased, where an inline `import { type X }`
 *   from a package still loads that package at run time. The compiler is an optional peer, so a
 *   repository that compiles no document must not load it, and the layer imports its types from
 *   this file instead.
 */

export type { Options as DocumentOptions } from "@mdx-js/rollup";
