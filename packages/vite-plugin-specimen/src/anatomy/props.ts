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
 *   TSDoc writes `defaultValue` and JSDoc writes `default`. A kit reads types from both, so reading
 *   one spelling means a column of dashes wherever the other was written.
 */
const DEFAULTS = new Set(["default", "defaultValue"]);

/**
 * Returns the directory of the package a file belongs to.
 *
 * @remarks
 *   Asked of the compiler rather than matched against a path, so a workspace link, an installed
 *   copy and a nested package all resolve correctly. The compiler reports an empty directory for
 *   one of its own libraries and for a file with no manifest above it, and neither belongs to a
 *   package.
 * @returns The directory, or undefined for a file in no package.
 * @throws {@link Error} When the file is not part of the program.
 */
function packageOf(program: Program, file: string): string | undefined {
  const { packageJsonDirectory } = sure(
    program.getSourceFileMetadata(file),
    `the package containing ${file}`,
  );

  return packageJsonDirectory === "" ? undefined : packageJsonDirectory;
}

/**
 * Where a declaration's file is, seen from a specimen's package: a recipe, the package or one of
 * its dependencies, or anywhere else.
 */
type Placement = "foreign" | "own" | "recipe";

/**
 * Describes the package a specimen belongs to: where it is, and the packages it depends on.
 *
 * @remarks
 *   A declaration in a dependency is part of what the component accepts. A menu built over a state
 *   machine takes `open` and `onOpenChange` from the machine's package, and a caller sets them on
 *   the menu. A peer declares what every component takes, such as the rendering library's
 *   attributes and the foundation's style props, and a table does not render those. The walk
 *   follows `dependencies` alone, so a peer is foreign at any depth. The dependencies are kept as
 *   directories, which Node and the compiler both resolve through the real path of a link, so a
 *   workspace package and an installed one compare the same way.
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

  /**
   * The placement of every declaration's file classified so far, by path.
   *
   * @remarks
   *   A button's part resolves to 1341 properties, whose declarations are in a few dozen files, so
   *   each file is classified once.
   */
  placements: Map<string, Placement>;
}

/**
 * Reads the package a specimen belongs to and the packages it depends on, once per package.
 *
 * @remarks
 *   `homes` contains the packages read so far, by directory, and a package read here is added to
 *   it.
 * @throws {@link Error} When no package contains the specimen.
 */
export function homeOf(program: Program, specimen: string, homes: Map<string, Home>): Home {
  const at = sure(packageOf(program, specimen), `the package containing ${specimen}`);
  const known = homes.get(at);

  if (known !== undefined) return known;

  const home: Home = {
    at,
    dependencies: new Set(dependencies(at).map((one) => one.at)),
    placements: new Map(),
  };

  homes.set(at, home);

  return home;
}

/**
 * Returns true when a file belongs to the specimen's package or to a package it depends on.
 */
function ownedBy(program: Program, home: Home, file: string): boolean {
  const at = packageOf(program, file);

  return at !== undefined && (at === home.at || home.dependencies.has(at));
}

/**
 * Returns where a declaration's file is, seen from the specimen's package, classifying each file
 * once.
 */
function placementOf(program: Program, home: Home, file: string): Placement {
  const known = home.placements.get(file);

  if (known !== undefined) return known;

  const placement = isRecipe(file) ? "recipe" : ownedBy(program, home, file) ? "own" : "foreign";

  home.placements.set(file, placement);

  return placement;
}

/**
 * Classifies a property by every declaration it has.
 *
 * @remarks
 *   A property with no declaration at all is a styling condition: 284 of the 1341 a button resolves
 *   to are. One declaration in a recipe makes the property a variant however many style props share
 *   its name.
 * @returns The kind, or undefined for a property no table renders.
 */
export function kindOf(program: Program, property: Named, home: Home): Kind | undefined {
  let own = false;

  for (const declaration of property.declarations) {
    const placement = placementOf(program, home, declaration.path);

    if (placement === "recipe") return "variant";
    if (placement === "own") own = true;
  }

  return own ? "option" : undefined;
}

/**
 * A property a part resolves to, with the kind its declarations give it.
 */
interface Classified {
  /**
   * The kind, or undefined for a property no table renders.
   */
  kind: Kind | undefined;

  /**
   * The property.
   */
  property: Named;
}

/**
 * Reads one property into the row a table renders, when a table renders it.
 */
function propOf({ kind, property }: Classified, walk: Walk): Prop[] {
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
 * Counts the properties a part resolves to that no table renders.
 */
function droppedOf(members: readonly Classified[]): Dropped {
  let conditions = 0;
  let foreign = 0;

  for (const { kind, property } of members) {
    if (property.declarations.length === 0) conditions += 1;
    else if (kind === undefined) foreign += 1;
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
 * Returns the distance of a module from a specimen: 0 beside it, 1 anywhere else.
 */
function distanceOf(module: Named, beside: string): number {
  return module.declarations.some((declaration) => declaration.path.startsWith(beside)) ? 0 : 1;
}

/**
 * Orders the modules a specimen imports with the ones beside it first.
 *
 * @remarks
 *   What a specimen documents is in its own directory, and what it borrows to render a scene is
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
   * The packages read so far, by directory, which the reader adds the specimen's package to.
   */
  homes: Map<string, Home>;

  /**
   * Returns the modules a specimen imports, in the order the file imports them.
   */
  imports: (project: Project, specimen: string) => readonly Named[];

  /**
   * The reading the reader follows, with every default filled in.
   */
  stated: Settled;
}

/**
 * Reads a specimen's parts and what they accept.
 *
 * @remarks
 *   A part is a `*Props` type exported by a module the specimen imports from its own package,
 *   beside the part or the factory it is named after. The specimen already names what it renders,
 *   so nothing here guesses from a title, and a module from another package is that package's to
 *   document. Where two modules export a part of one name, the reader keeps the nearer module's
 *   part, so a page documents its own `RootProps` and not the one of a field it renders inside.
 */
export function anatomyOf(project: Project, specimen: string, driving: Driving): Anatomy {
  const { checker, program } = project;
  const home = homeOf(program, specimen, driving.homes);
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
      if (!exported.name.endsWith("Props") || Object.hasOwn(parts, exported.name)) continue;
      if (!partOf(module, exported, walk)) continue;

      const members = checker
        .getPropertiesOfType(checker.getDeclaredTypeOfSymbol(exported))
        .map((property) => ({ kind: kindOf(program, property, home), property }));

      dropped[exported.name] = droppedOf(members);
      parts[exported.name] = members
        .flatMap((member) => propOf(member, walk))
        .toSorted((one, other) => one.name.localeCompare(other.name));
    }
  }

  return { dropped, parts, shapes: walk.into };
}

export { keyOf };
