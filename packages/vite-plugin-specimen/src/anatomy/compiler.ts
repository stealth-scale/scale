/**
 * Runs the TypeScript compiler over the workspace and keeps it open across the pages a catalogue
 * requests.
 *
 * @remarks
 *   The props of a component cannot be read from the component at runtime. A component built by a
 *   factory reports two props at runtime, and neither is its own. The exported `*Props` type
 *   contains the props, and resolving it needs a type checker. The module starts one compiler
 *   process, opens a program for every page the index lists, and keeps the programs between
 *   reads. The compiler loads on the first props request, so a catalogue without props reading
 *   never starts it, and an installation without TypeScript still indexes.
 */

import { join } from "node:path";

import { programsOf } from "#anatomy/program.ts";
import { anatomyOf, type Home } from "#anatomy/props.ts";
import { type Settled } from "#anatomy/reading.ts";
import { type Symbol as Named, type Project, type Snapshot } from "#anatomy/types.ts";
import { sure } from "#anatomy/walk.ts";
import { type Anatomy } from "#contract.ts";
import { EXAMPLE } from "#example.ts";

/**
 * Open compiler.
 */
export interface Compiler {
  /**
   * Returns the parts of one specimen and the props each part accepts.
   *
   * @throws {@link Error} When no project contains the specimen.
   */
  anatomyOf: (specimen: string, stated: Settled) => Anatomy;

  /**
   * Stops the compiler.
   */
  close: () => void;

  /**
   * Drops every file read and every program, so the next read starts a compiler that sees the
   * current files and the pages the index lists then.
   *
   * @remarks
   *   A snapshot keeps the text it first read for each file. Opening the programs again costs
   *   about 300 milliseconds for the catalogue, which is cheaper than reading props from stale
   *   text.
   */
  restart: () => void;
}

/**
 * Describes what a compiler reads besides the files: the pages, and where it writes the
 * configuration of each program it opens.
 */
export interface Compiling {
  /**
   * Vite's cache directory. The compiler writes its programs' configurations into `specimen`
   * under it.
   */
  cache: string;

  /**
   * Lists every page the index lists, as absolute paths, at the moment the compiler starts.
   */
  specimens: () => readonly string[];
}

/**
 * State of one running compiler.
 */
interface Running {
  /**
   * Compiler process.
   */
  api: InstanceType<typeof import("typescript/unstable/sync").API>;

  /**
   * Package of every specimen read so far, by the package's directory.
   *
   * @remarks
   *   Reading a package walks the manifest of every package it depends on, and the catalogue's 179
   *   pages belong to 20 packages. A restart drops the packages with the compiler.
   */
  homes: Map<string, Home>;

  /**
   * The configuration of the program each page is read under.
   */
  programs: ReadonlyMap<string, string>;

  /**
   * Snapshot every query reads, with every program open.
   */
  snapshot: Snapshot;
}

/**
 * Type guard for an import declaration, from the compiler's AST module.
 */
type IsImport = (typeof import("typescript/unstable/ast/is"))["isImportDeclaration"];

/**
 * Returns the modules one file imports, as the compiler resolves them.
 *
 * @param project - Project that contains the file.
 * @param file - Absolute path of the file.
 * @param isImport - Type guard for an import declaration.
 */
function importedBy(project: Project, file: string, isImport: IsImport): readonly Named[] {
  const source = sure(project.program.getSourceFile(file), `the source of ${file}`);

  return source.statements.flatMap((statement) => {
    if (!isImport(statement)) return [];

    const module = project.checker.getSymbolAtLocation(statement.moduleSpecifier);

    return module === undefined ? [] : [module];
  });
}

/**
 * Returns the path of the file that declares a module.
 *
 * @throws {@link Error} When the module has no declaration, which a resolved import always has.
 */
function pathOf(module: Named): string {
  return sure(module.declarations[0], "the declaration of an imported module").path;
}

/**
 * Returns the modules a specimen imports, followed by the modules its example files import.
 *
 * @remarks
 *   A specimen renders its components through example files, so the components are often imported
 *   only by an example. The reader looks for `*Props` exports in these modules. Each module appears
 *   once, at its first import: the catalogue's 179 pages import the 1058 parts they document 2515
 *   times.
 * @param project - Project that contains the specimen.
 * @param specimen - Absolute path of the specimen.
 * @param isImport - Type guard for an import declaration.
 */
function importsOf(project: Project, specimen: string, isImport: IsImport): readonly Named[] {
  const direct = importedBy(project, specimen, isImport);
  const through = direct.flatMap((module) =>
    EXAMPLE.test(pathOf(module)) ? importedBy(project, pathOf(module), isImport) : [],
  );

  return [...new Set([...direct, ...through])];
}

/**
 * Starts the compiler and returns it open.
 *
 * @param cwd - Working directory of the compiler, where it looks for projects.
 * @param compiling - The pages, and the cache directory the programs' configurations are written
 *   under.
 * @throws {@link Error} When TypeScript is not installed.
 */
export async function compiler(cwd: string, compiling: Compiling): Promise<Compiler> {
  const { API, SignatureKind, SymbolFlags } = await import("typescript/unstable/sync");
  const { isImportDeclaration } = await import("typescript/unstable/ast/is");
  const enumerated = {
    alias: SymbolFlags.Alias,
    call: SignatureKind.Call,
    optional: SymbolFlags.Optional,
    value: SymbolFlags.Value,
  };
  let running: Running | undefined;

  /**
   * Returns the running compiler, and starts one with every program open when none is running.
   */
  function started(): Running {
    if (running === undefined) {
      const api = new API({ cwd });
      const programs = programsOf(
        (config) => api.parseConfigFile(config),
        compiling.specimens(),
        join(compiling.cache, "specimen"),
      );
      const snapshot = api.updateSnapshot({ openProjects: [...new Set(programs.values())] });

      running = { api, homes: new Map(), programs, snapshot };
    }

    return running;
  }

  /**
   * Returns the program a specimen is read under.
   *
   * @throws {@link Error} When the index listed no such page when the compiler started, or no
   *   configuration is above it.
   */
  function projectOf(specimen: string): Project {
    const held = started();
    const config = held.programs.get(specimen);

    return sure(
      config === undefined ? undefined : held.snapshot.getProject(config),
      `a project containing ${specimen}`,
    );
  }

  /**
   * Returns the modules a specimen and its example files import.
   */
  function imports(project: Project, specimen: string): readonly Named[] {
    return importsOf(project, specimen, isImportDeclaration);
  }

  /**
   * Stops the running compiler, if one is running.
   */
  function stop(): void {
    running?.snapshot.dispose();
    running?.api.close();
    running = undefined;
  }

  return {
    anatomyOf: (specimen, stated) =>
      anatomyOf(projectOf(specimen), specimen, {
        enumerated,
        homes: started().homes,
        imports,
        stated,
      }),

    close: stop,

    restart: stop,
  };
}
