/**
 * Composes the programs the reader type-checks pages in, one for each set of compiler options.
 *
 * @remarks
 *   A page opened as a file loads the project of its package, and each project checks every type
 *   the packages share, such as the rendering library's and the styling foundation's. The pages of
 *   packages that parse to the same options share one program instead. A program lists its pages
 *   as its files, and the compiler adds what they import.
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

/**
 * The name of the file the compiler reads a project's options from.
 */
const CONFIG = "tsconfig.json";

/**
 * Describes a configuration the compiler parsed.
 */
export interface Parsed {
  /**
   * The options the compiler resolved, the file they were read from included.
   */
  readonly options: Readonly<Record<string, unknown>>;
}

/**
 * Parses a project's configuration into the options the compiler resolves.
 */
export type Parse = (config: string) => Parsed;

/**
 * Describes one program: the configuration it extends, the pages it lists, and where it is
 * written.
 */
interface Program {
  /**
   * The configuration of the first page's package, which every page of the program shares.
   */
  readonly extended: string;

  /**
   * The pages the program lists as its files.
   */
  readonly files: string[];

  /**
   * The path the program's configuration is written to.
   */
  readonly path: string;
}

/**
 * Returns the nearest configuration at or above a directory, the one the compiler reads a file in
 * that directory under.
 *
 * @returns The configuration's path, or undefined where no directory above has one.
 */
function nearest(directory: string): string | undefined {
  const config = join(directory, CONFIG);

  if (existsSync(config)) return config;

  const above = dirname(directory);

  return above === directory ? undefined : nearest(above);
}

/**
 * Returns the key two configurations share when the compiler resolves them to the same options.
 *
 * @remarks
 *   The resolved options include the path of the file they were read from, which is the one field
 *   that differs between two packages extending the same tiers. `keys` contains each configuration
 *   parsed so far, so a configuration is parsed once.
 */
function keyOf(parse: Parse, config: string, keys: Map<string, string>): string {
  const known = keys.get(config);

  if (known !== undefined) return known;

  const key = JSON.stringify({ ...parse(config).options, configFilePath: undefined });

  keys.set(config, key);

  return key;
}

/**
 * Writes one configuration for each set of options the pages' packages parse to.
 *
 * @param parse - Parses a configuration.
 * @param specimens - Every page the index lists, as absolute paths.
 * @param at - The directory the configurations are written into.
 * @returns The configuration each page is read under. A page with no configuration above it has
 *   none.
 */
export function programsOf(
  parse: Parse,
  specimens: readonly string[],
  at: string,
): ReadonlyMap<string, string> {
  const keys = new Map<string, string>();
  const programs = new Map<string, Program>();
  const placed = new Map<string, string>();

  for (const specimen of specimens) {
    const config = nearest(dirname(specimen));

    if (config === undefined) continue;

    const key = keyOf(parse, config, keys);
    const program = programs.get(key) ?? {
      extended: config,
      files: [],
      path: join(at, `program-${String(programs.size)}.json`),
    };

    program.files.push(specimen);
    programs.set(key, program);
    placed.set(specimen, program.path);
  }

  mkdirSync(at, { recursive: true });

  for (const { extended, files, path } of programs.values()) {
    writeFileSync(path, JSON.stringify({ extends: extended, files, include: [] }));
  }

  return placed;
}
