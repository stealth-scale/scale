/**
 * Runs the TypeScript compiler over the workspace and keeps it open across the pages a catalogue
 * requests.
 *
 * @remarks
 *   The props of a component cannot be read from the component at runtime. A component built by a
 *   factory reports two props at runtime, and neither is its own. The exported `*Props` type holds
 *   the props, and resolving it needs a type checker. The module starts one compiler process and
 *   keeps its projects between reads. The compiler loads on the first props request, so a catalogue
 *   without props reading never starts it, and an installation without TypeScript still indexes.
 */

import { anatomyOf } from "#anatomy/props.ts";
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
   * Drops every file read, so the next read starts a compiler that sees the current files.
   *
   * @remarks
   *   A snapshot keeps the text it first read for each file. A restart costs tens of milliseconds,
   *   which is cheaper than answering from stale text.
   */
  restart: () => void;
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
   * Files opened so far. Opening a file adds its project to the snapshot.
   */
  opened: Set<string>;

  /**
   * Snapshot that answers every query.
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
 *   only by an example. The reader looks for `*Props` exports in these modules. A module imported
 *   twice appears twice, and the reader writes the same parts again under the same names.
 * @param project - Project that contains the specimen.
 * @param specimen - Absolute path of the specimen.
 * @param isImport - Type guard for an import declaration.
 */
function importsOf(project: Project, specimen: string, isImport: IsImport): readonly Named[] {
  const direct = importedBy(project, specimen, isImport);
  const through = direct.flatMap((module) =>
    EXAMPLE.test(pathOf(module)) ? importedBy(project, pathOf(module), isImport) : [],
  );

  return [...direct, ...through];
}

/**
 * Starts the compiler and returns it open.
 *
 * @param cwd - Working directory of the compiler, where it looks for projects.
 * @throws {@link Error} When TypeScript is not installed.
 */
export async function compiler(cwd: string): Promise<Compiler> {
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
   * Returns the running compiler, and starts one when none is running.
   */
  function started(): Running {
    if (running === undefined) {
      const api = new API({ cwd });

      running = { api, opened: new Set(), snapshot: api.updateSnapshot() };
    }

    return running;
  }

  /**
   * Returns the project that contains a specimen, and opens the file when it is not open yet.
   *
   * @throws {@link Error} When no project contains the file.
   */
  function projectOf(specimen: string): Project {
    const held = started();

    if (!held.opened.has(specimen)) {
      held.opened.add(specimen);
      held.snapshot.dispose();
      held.snapshot = held.api.updateSnapshot({ openFiles: [specimen] });
    }

    return sure(held.snapshot.getDefaultProjectForFile(specimen), `a project holding ${specimen}`);
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
      anatomyOf(projectOf(specimen), specimen, { enumerated, imports, stated }),

    close: stop,

    restart: stop,
  };
}
