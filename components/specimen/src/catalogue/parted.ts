/**
 * Shapes what a page's parts accept into the rows a table draws.
 */

import { type Anatomy, type Dropped, type Member, type Prop } from "#catalogue/types.ts";

/**
 * Describes one named type a prop refers to, and what is in it.
 */
export interface Shown {
  /**
   * The members of the type, or empty where it is named but not listed, which is what the reader
   * does past its cap or its depth.
   */
  members: readonly Member[];

  /**
   * The name the type is printed under, which is what a reader opens it by.
   */
  name: string;
}

/**
 * Describes one row: the prop, and each named type it refers to.
 */
export interface Row {
  /**
   * The prop the row is drawn for.
   */
  prop: Prop;

  /**
   * Each named type the prop refers to, in the order the prop named them. Kept apart rather than
   * merged, so a type opened from the table shows its own members and not the members of every type
   * the prop names.
   */
  shows: readonly Shown[];
}

/**
 * Describes one part, split into the two groups a table heads separately.
 */
export interface Part {
  /**
   * The component the props belong to, as a caller writes it.
   */
  component: string;

  /**
   * The counts of what the reader resolved and no table draws.
   */
  dropped: Dropped;

  /**
   * The name the part is exported under.
   */
  name: string;

  /**
   * The props a caller sets, sorted by name.
   */
  options: readonly Row[];

  /**
   * The axes a theme moves, sorted by name.
   */
  variants: readonly Row[];
}

/**
 * The counts to report for a part the reader recorded no drops against.
 */
const NONE: Dropped = { conditions: 0, foreign: 0 };

/**
 * Returns one row per prop, each carrying the members of the types it refers to.
 */
function rowsOf(props: readonly Prop[], shapes: Anatomy["shapes"]): readonly Row[] {
  return props.map((prop) => ({
    prop,
    shows: prop.refers.map((named) => ({ members: shapes[named] ?? [], name: named })),
  }));
}

/**
 * Reads the name a type is printed under, off the key the reader holds it by.
 *
 * @remarks
 *   The reader keys a shape by the package that declared it and the name, `kit.Scale`, so two
 *   packages exporting one name are two shapes. The compiler prints the name alone, so a table
 *   matching a printed type against the key matches nothing at all.
 * @param key - The key the reader holds the shape by.
 * @returns The name the compiler prints it under.
 */
export function shortOf(key: string): string {
  return key.slice(key.lastIndexOf(".") + 1);
}

/**
 * Counts what a part accepts, which is what decides where it is listed.
 */
function accepts(part: Part): number {
  return part.options.length + part.variants.length;
}

/**
 * Returns the component a part's props belong to, as a caller writes it.
 *
 * @remarks
 *   A part is keyed by the interface it declares, `RootProps`, which names a type and not a thing
 *   to draw. The component is the page and the part together, `Menu.Root`, because a package of
 *   parts is exported as one namespace and that is how every example on the page writes it.
 *   A part whose name is the page's own is the whole component rather than a part of it, so
 *   `ButtonProps` on the button's page is `Button` and not `Button.Button`.
 * @param page - The page's title, which is the namespace the parts are exported under.
 * @param part - The name the part is exported under.
 * @returns The component, as a caller writes it.
 */
export function componentOf(page: string, part: string): string {
  const short = part.endsWith("Props") ? part.slice(0, -"Props".length) : part;

  return short === "" || short === page ? page : `${page}.${short}`;
}

/**
 * Returns each part of a page, its props split by kind and its dropped counts beside them.
 *
 * @remarks
 *   The parts that accept something are listed first, each group sorted by name, so a table drawn
 *   from this is stable across reads. A part the reader found nothing for is kept and listed after
 *   them: it is a part a caller can draw, and its dropped counts are the answer to why its table is
 *   empty, but four of them at the head of the band push every part with something to say off the
 *   first screen.
 *   A part whose props are every one of them the element's own is the usual case for a slot bound
 *   through a context, which takes its variants from the root rather than from a caller.
 * @param anatomy - The parts, shapes and dropped counts the reader resolved for the page.
 * @param page - The page's title, which names the component the parts belong to.
 * @returns Each part, the ones that accept something first.
 */
export function parted(anatomy: Anatomy, page: string): readonly Part[] {
  return Object.entries(anatomy.parts)
    .map(([name, props]) => {
      const rows = rowsOf(props, anatomy.shapes);

      return {
        component: componentOf(page, name),
        dropped: anatomy.dropped[name] ?? NONE,
        name,
        options: rows.filter((row) => row.prop.kind === "option"),
        variants: rows.filter((row) => row.prop.kind === "variant"),
      };
    })
    .toSorted(
      (one, next) =>
        Number(accepts(one) === 0) - Number(accepts(next) === 0) ||
        one.name.localeCompare(next.name),
    );
}
