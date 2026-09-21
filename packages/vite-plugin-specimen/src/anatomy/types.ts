/**
 * Re-exports the compiler types the reader is written against.
 *
 * @remarks
 *   Collected in one file because a top-level `export type` is erased at compile time, while an
 *   inline `import { type X }` still loads the package at run time. TypeScript is an optional peer,
 *   so a catalogue that reads no props must never load it. Every module in this directory imports
 *   its types from here.
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
