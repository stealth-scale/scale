/**
 * Reads the parts a specimen documents and the props each one accepts.
 *
 * @remarks
 *   A part resolves to far more than it accepts, so every property is classified by where it was
 *   declared. A property declared by a recipe is a variant, one declared by the component's own
 *   package or by a package it depends on at run time is an option, and one declared anywhere else
 *   is dropped and counted. Every declaration is read rather than the first. `gap` on a list is
 *   declared twice, by the generated style props and by the recipe, and `aria-label` on an icon
 *   button three times, twice by the rendering library and once by the component. Reading only the
 *   first drops all three.
 */

import { dirname } from "node:path";

import { dependencies } from "@stealthscale/vite-plugin-base";

import { isRecipe, type Settled } from "#anatomy/reading.ts";
import { type Symbol as Named, type Program, type Project } from "#anatomy/types.ts";
import {
  type Enumerated,
  keyOf,
  opening,
  printed,
  shapesIn,
  sure,
  type Walk,
} from "#anatomy/walk.ts";
import { type Anatomy, type Dropped, type Kind, type Prop } from "#contract.ts";

/**
 * The two spellings of the tag that states a default.
 *
 * @remarks
 *   TSDoc says `defaultValue` and JSDoc says `default`. A kit reads types from both, so reading one
 *   spelling means a column of dashes wherever the other was written.
 */
const DEFAULTS = new Set(["default", "defaultValue"]);

/**
 * Returns the directory of the package a file belongs to.
 *
 * @remarks
 *   Asked of the compiler rather than matched against a path, so a workspace link, an installed
 *   copy and a nested package all answer correctly. The compiler reports an empty directory for
 *   one of its own libraries and for a file with no manifest above it, and neither belongs to a
 *   package.
 * @returns The directory, or undefined for a file in no package.
 * @throws {@link Error} When the file is not part of the program.
 */
function packageOf(program: Program, file: string): string | undefined {
  const { packageJsonDirectory } = sure(
    program.getSourceFileMetadata(file),
    `the package holding ${file}`,
  );

  return packageJsonDirectory === "" ? undefined : packageJsonDirectory;
}

/**
 * Describes the package a specimen belongs to: where it is, and the packages it depends on.
 *
 * @remarks
 *   A declaration in a dependency is part of what the component accepts. A menu built over a state
 *   machine takes `open` and `onOpenChange` from the machine's package, and a caller sets them on
 *   the menu. A peer declares what every component takes, such as the rendering library's
 *   attributes and the foundation's style props, and a table does not draw those. The walk follows
 *   `dependencies` alone, so a peer stays foreign however deep it sits. The dependencies are held
 *   as directories, which Node and the compiler both resolve through the real path of a link, so
 *   a workspace package and an installed one compare the same way.
 */
export interface Home {
  /**
   * The package's directory, as the compiler reports it.
   */
  at: string;

  /**
   * The directory of every package it depends on at run time, the transitive ones included.
   */
  dependencies: ReadonlySet<string>;
}

/**
 * Reads the package a specimen belongs to and the packages it depends on.
 *
 * @throws {@link Error} When the specimen sits in no package.
 */
export function homeOf(program: Program, specimen: string): Home {
  const at = sure(packageOf(program, specimen), `the package holding ${specimen}`);

  return { at, dependencies: new Set(dependencies(at).map((one) => one.at)) };
}

/**
 * Returns true when a file belongs to the specimen's package or to a package it depends on.
 */
function ownedBy(program: Program, home: Home, file: string): boolean {
  const at = packageOf(program, file);

  return at !== undefined && (at === home.at || home.dependencies.has(at));
}

/**
 * Classifies a property by every declaration it carries.
 *
 * @remarks
 *   A property with no declaration at all is a styling condition: 284 of the 1341 a button resolves
 *   to are. Signal wins over noise, so one declaration in a recipe makes the property a variant
 *   however many style props share its name.
 * @returns The kind, or undefined for a property no table draws.
 */
export function kindOf(program: Program, property: Named, home: Home): Kind | undefined {
  let own = false;

  for (const declaration of property.declarations) {
    if (isRecipe(declaration.path)) return "variant";
    if (ownedBy(program, home, declaration.path)) own = true;
  }

  return own ? "option" : undefined;
}

/**
 * Reads one property into the row a table draws, where a table draws it.
 */
function propOf(program: Program, property: Named, walk: Walk, home: Home): Prop[] {
  const kind = kindOf(program, property, home);

  if (kind === undefined) return [];

  const type = sure(walk.checker.getTypeOfSymbol(property), `the type of ${property.name}`);

  walk.found.clear();
  shapesIn(type, walk, 0);

  const tag = walk.checker.getJsDocTagsOfSymbol(property).find((each) => DEFAULTS.has(each.name));

  return [
    {
      accepts: printed(walk.checker, type),
      fallback: tag?.text?.trim() ?? "",
      kind,
      name: property.name,
      refers: [...walk.found].toSorted(),
      required: (property.flags & walk.enumerated.optional) === 0,
      says: opening(walk.checker.getDocumentationCommentOfSymbol(property)),
    },
  ];
}

/**
 * Counts the properties a part resolves to that no table draws.
 */
function droppedOf(program: Program, members: readonly Named[], home: Home): Dropped {
  let conditions = 0;
  let foreign = 0;

  for (const member of members) {
    if (member.declarations.length === 0) conditions += 1;
    else if (kindOf(program, member, home) === undefined) foreign += 1;
  }

  return { conditions, foreign };
}

/**
 * Returns true when a `*Props` type belongs to a part or a factory the module also exports as a
 * value.
 *
 * @remarks
 *   `RootProps` beside `Root` is a part, and `CreateOverlayProps` beside `createOverlay` is the
 *   props the factory passes to the component it is given. `RootBaseProps`, which the root's own
 *   props type is built from, is not.
 */
function partOf(module: Named, exported: Named, walk: Walk): boolean {
  const { alias, value } = walk.enumerated;
  const stem = exported.name.slice(0, -5);
  const named =
    walk.checker.getMemberInModuleExports(module, stem) ??
    walk.checker.getMemberInModuleExports(module, stem.charAt(0).toLowerCase() + stem.slice(1));

  if (named === undefined) return false;

  const held = (named.flags & alias) === 0 ? named : walk.checker.getAliasedSymbol(named);

  return (held.flags & value) !== 0;
}

/**
 * Returns how far a module sits from a specimen: nothing beside it, one anywhere else.
 */
function distanceOf(module: Named, beside: string): number {
  return module.declarations.some((declaration) => declaration.path.startsWith(beside)) ? 0 : 1;
}

/**
 * Orders the modules a specimen imports with the ones beside it first.
 *
 * @remarks
 *   What a specimen documents lives in its own directory, and what it borrows to draw a scene is
 *   listed after.
 */
function nearestFirst(modules: readonly Named[], specimen: string): Named[] {
  const beside = `${dirname(specimen)}/`;

  return modules.toSorted((one, other) => distanceOf(one, beside) - distanceOf(other, beside));
}

/**
 * Describes what the reader is driven with beyond the project itself.
 */
export interface Driving {
  /**
   * The compiler's enumerations, which exist only once it has loaded.
   */
  enumerated: Enumerated;

  /**
   * Returns the modules a specimen imports, in the order the file imports them.
   */
  imports: (project: Project, specimen: string) => readonly Named[];

  /**
   * The reading, with every default filled in.
   */
  stated: Settled;
}

/**
 * Reads a specimen's parts and what they accept.
 *
 * @remarks
 *   A part is a `*Props` type exported by a module the specimen imports from its own package,
 *   beside the part or the factory it is named after. The specimen already names what it draws, so
 *   nothing here guesses from a title, and a module from another package is that package's to
 *   document.
 */
export function anatomyOf(project: Project, specimen: string, driving: Driving): Anatomy {
  const { checker, program } = project;
  const home = homeOf(program, specimen);
  const walk: Walk = {
    checker,
    enumerated: driving.enumerated,
    found: new Set(),
    into: {},
    program,
    stated: driving.stated,
  };
  const dropped: Record<string, Dropped> = {};
  const parts: Record<string, Prop[]> = {};

  for (const module of nearestFirst(driving.imports(project, specimen), specimen)) {
    const at = module.declarations[0]?.path;

    if (at === undefined || packageOf(program, at) !== home.at) continue;

    for (const exported of checker.getExportsOfModule(module)) {
      if (!exported.name.endsWith("Props")) continue;
      if (!partOf(module, exported, walk)) continue;

      const members = checker.getPropertiesOfType(checker.getDeclaredTypeOfSymbol(exported));

      dropped[exported.name] = droppedOf(program, members, home);
      parts[exported.name] = members
        .flatMap((property) => propOf(program, property, walk, home))
        .toSorted((one, other) => one.name.localeCompare(other.name));
    }
  }

  return { dropped, parts, shapes: walk.into };
}

export { keyOf };
