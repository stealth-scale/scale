/**
 * Re-exports the compiler types the reader is written against.
 *
 * @remarks
 *   Gathered here because a top-level `export type` is erased, where an inline `import { type X }`
 *   from a package still loads that package at run time. TypeScript is an optional peer, so a
 *   catalogue that reads no props must not load it, and every module below imports its types from
 *   this file instead.
 */

export type { Compiler } from "#anatomy/compiler.ts";
export type {
  Checker,
  Program,
  Project,
  Snapshot,
  Symbol,
  Type,
  UnionType,
} from "typescript/unstable/sync";
