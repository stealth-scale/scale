/**
 * Declares the types a catalogue reads out of the emitted modules, and the types the reader
 * produces on the way there.
 *
 * @remarks
 *   The plugin owns these because the plugin writes the modules. A kit that draws the pages imports
 *   them from here, so the dependency points one way.
 */

/**
 * Selects the group a table draws a prop's row under.
 *
 * @remarks
 *   A variant is declared by the component's recipe and is the axis a theme moves. An option is
 *   declared by the component's own package or by a package it depends on at run time, such as the
 *   state machine a menu is built over, and is everything else a caller sets. A property declared
 *   anywhere else is dropped, and counted rather than hidden.
 */
export type Kind = "option" | "variant";

/**
 * Describes one prop, flattened to what a table draws.
 */
export interface Prop {
  /**
   * The type as the compiler prints it, without the optional half.
   */
  accepts: string;

  /**
   * The value the component falls back to when nobody passes the prop. Empty where the
   * declaration states none.
   */
  fallback: string;

  /**
   * Which kind of prop it is, which is what a table groups by.
   */
  kind: Kind;

  /**
   * The name a caller writes.
   */
  name: string;

  /**
   * The named types this prop's type refers to, so a table can show what is in them. Sorted.
   */
  refers: string[];

  /**
   * Whether a caller has to pass it.
   */
  required: boolean;

  /**
   * The opening sentence of the prop's doc comment. Empty for most variants, because a recipe
   * generates its axes rather than documenting them.
   */
  says: string;
}

/**
 * Describes one member of a type a prop refers to.
 */
export interface Member {
  /**
   * The member's type as the compiler prints it. Empty for an option of a union, which has a name
   * and no type of its own.
   */
  accepts: string;

  /**
   * The member's name, or the option as it prints.
   */
  name: string;

  /**
   * The opening sentence of the member's doc comment. Empty where it has none.
   */
  says: string;
}

/**
 * Counts the properties a part resolves to that no table draws.
 *
 * @remarks
 *   Reported rather than hidden. One root resolves to 1341 properties of which six are its own, and
 *   a table that silently drops 1335 of them is a table nobody can trust.
 */
export interface Dropped {
  /**
   * Properties with no declaration at all, which is what a styling condition resolves to.
   */
  conditions: number;

  /**
   * Properties declared outside the component's package, its dependencies and a recipe: the style
   * props, the rendering library's own, and the factory's.
   */
  foreign: number;
}

/**
 * Describes what one page's components accept.
 */
export interface Anatomy {
  /**
   * The properties each part resolves to that no table draws, keyed by the part.
   */
  dropped: Record<string, Dropped>;

  /**
   * Every part against the props it takes, each sorted by name.
   */
  parts: Record<string, Prop[]>;

  /**
   * The named types those props refer to, keyed by the package that declared them and the name.
   */
  shapes: Record<string, Member[]>;
}

/**
 * Describes one specimen file as the reader receives it.
 */
export interface Source {
  /**
   * The absolute path of the file, with forward slashes.
   */
  path: string;

  /**
   * The unparsed text of the file.
   */
  text: string;
}

/**
 * Describes one page the reader parsed out of a file.
 */
export interface Entry {
  /**
   * The sentence the page opens with. Empty when the file declares none.
   */
  about: string;

  /**
   * The group a navigation rail lists the page under. Empty when the file declares none.
   */
  group: string;

  /**
   * The identifier the page is addressed by.
   */
  id: string;

  /**
   * The catalogue namespace the page's words are keys in. Empty when the file declares none, and
   * the words are then keys in the catalogue's own namespace.
   */
  namespace: string;

  /**
   * The absolute path of the file, which the emitted loader imports.
   */
  path: string;

  /**
   * The page title. Derived from the last segment of the identifier when the file declares none.
   */
  title: string;
}

/**
 * Describes a file that matched a pattern and declares no page.
 */
export interface Refused {
  /**
   * The absolute path of the file, with forward slashes.
   */
  path: string;

  /**
   * The reason the file declares no page.
   */
  wrong: string;
}

/**
 * Describes the page a file declares, or the reason it declares none.
 */
export type Read = Entry | Refused;

/**
 * Describes the module a bundler returns for a file imported as text.
 */
export interface Raw {
  /**
   * The text of the file.
   */
  default: string;
}

/**
 * Describes the module the plugin returns for one page's scenes as source.
 */
export interface Fragments {
  /**
   * Each scene's source, keyed by the scene's title. A scene whose title the file does not declare
   * as a string literal has no entry.
   */
  fragments: Record<string, string>;

  /**
   * The components the file imports from its own package, sorted. A name is a value the file
   * binds from a specifier under the package's imports map, and it starts with a capital letter.
   */
  imported: string[];
}

/**
 * Describes one page as the emitted index lists it.
 *
 * @remarks
 *   A file that declares no page is listed too, under its path, with the reason as its opening and
 *   a loader that rejects with the same reason. A dev server therefore keeps serving every other
 *   page while one file is half-written.
 */
export interface Indexed {
  /**
   * The sentence the page opens with. Empty when the file declares none.
   */
  about: string;

  /**
   * Loads each scene's source. Absent on a file that declares no page.
   */
  fragments?: (() => Promise<Fragments>) | undefined;

  /**
   * The group a navigation rail lists the page under. Empty when the file declares none.
   */
  group: string;

  /**
   * The identifier the page is addressed by.
   */
  id: string;

  /**
   * Loads the module that declares the scenes.
   *
   * @remarks
   *   A dynamic import, so the bundler emits one chunk per specimen and excludes its components
   *   from the chunk that holds the index. A rail that lists 100 pages therefore loads no
   *   component.
   */
  load: () => Promise<unknown>;

  /**
   * The catalogue namespace the page's words are keys in. Empty when the file declares none, and
   * the words are then keys in the catalogue's own namespace.
   */
  namespace: string;

  /**
   * The name of the package the page's components are imported from. Empty when no manifest above
   * the file declares a name, and on a file that declares no page.
   */
  package: string;

  /**
   * The path of the file relative to the project root, with forward slashes on every platform.
   */
  path: string;

  /**
   * Loads what the page's components accept, read out of their types.
   *
   * @remarks
   *   Present where the index was asked to read props, and absent on a file that declares no page.
   *   Split like the scenes, so a catalogue pays for a page's props only where somebody opens them.
   */
  props?: (() => Promise<Anatomy>) | undefined;

  /**
   * Loads the text of the file.
   */
  source: () => Promise<Raw>;

  /**
   * The page title. Derived from the last segment of the identifier when the file declares none.
   */
  title: string;
}
