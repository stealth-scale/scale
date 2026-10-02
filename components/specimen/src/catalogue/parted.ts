/**
 * Converts the anatomy of a page into the parts and rows the props band renders.
 */

import { type Anatomy, type Dropped, type Member, type Prop } from "#catalogue/types.ts";

/**
 * A named type that a prop refers to, with its members.
 */
export interface Shown {
  /**
   * Members of the type. Empty when the reader named the type but did not list it, past its member
   * cap or its depth.
   */
  members: readonly Member[];

  /**
   * Printed name of the type.
   */
  name: string;
}

/**
 * Table row for a prop and the named types it refers to.
 */
export interface Row {
  /**
   * The prop the row renders.
   */
  prop: Prop;

  /**
   * Named types the prop refers to, in the order the prop names them.
   *
   * @remarks
   *   Each type is kept separate, so a type opened from the table shows its own members only.
   */
  shows: readonly Shown[];
}

/**
 * One part of a page, with its props split into the two groups a table heads separately.
 */
export interface Part {
  /**
   * Component the props belong to, written the way a caller writes it.
   */
  component: string;

  /**
   * Counts of the props the reader resolved and no table renders.
   */
  dropped: Dropped;

  /**
   * Exported name of the part's props type.
   */
  name: string;

  /**
   * Props a caller sets, sorted by name.
   */
  options: readonly Row[];

  /**
   * Recipe axes a theme changes, sorted by name.
   */
  variants: readonly Row[];
}

/**
 * Drop counts for a part without recorded drops.
 */
const NONE: Dropped = { conditions: 0, foreign: 0 };

/**
 * Returns one row per prop, each with the members of the types it refers to.
 */
function rowsOf(props: readonly Prop[], shapes: Anatomy["shapes"]): readonly Row[] {
  return props.map((prop) => ({
    prop,
    shows: prop.refers.map((named) => ({ members: shapes[named] ?? [], name: named })),
  }));
}

/**
 * Returns the printed name of a type from the key the reader stores it under.
 *
 * @remarks
 *   The reader keys a shape by its package and its name, such as `kit.Scale`, so two packages that
 *   export the same name produce two shapes. The compiler prints the name alone.
 * @param key - Key of the shape.
 * @returns The printed name.
 */
export function shortOf(key: string): string {
  return key.slice(key.lastIndexOf(".") + 1);
}

/**
 * Returns the number of props a part accepts, which decides its position in the list.
 */
function accepts(part: Part): number {
  return part.options.length + part.variants.length;
}

/**
 * Returns the namespace a page's parts are exported under, from the page ID.
 *
 * @remarks
 *   The last segment of the ID converts from kebab case to Pascal case, so
 *   `components/data/color-swatch` returns `ColorSwatch`. The page title is a translation key, not
 *   the name of an export.
 * @param id - Page ID.
 * @returns The namespace in Pascal case.
 */
export function namespaceOf(id: string): string {
  return id
    .slice(id.lastIndexOf("/") + 1)
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

/**
 * Returns the component a part's props belong to, written the way a caller writes it.
 *
 * @remarks
 *   A part is keyed by its props interface, such as `RootProps`. A namespaced part is written as
 *   the namespace and the part, such as `Menu.Root`. A part named after the namespace is the whole
 *   component, so `ButtonProps` on the button page is `Button`. A part whose name contains the
 *   namespace is a standalone export, so `ColorSwatchMixProps` is `ColorSwatchMix` and
 *   `IconButtonProps` is `IconButton`.
 * @param page - Namespace of the page, from {@link namespaceOf}.
 * @param part - Exported name of the part's props type.
 * @returns The component name.
 */
export function componentOf(page: string, part: string): string {
  const short = part.endsWith("Props") ? part.slice(0, -"Props".length) : part;

  if (short === "" || short === page) return page;

  return short.includes(page) ? short : `${page}.${short}`;
}

/**
 * Returns each part of a page with its props split by kind and its drop counts.
 *
 * @remarks
 *   Parts that accept props come first, and each group is sorted by name, so the table order is
 *   stable across reads. A part without props is kept after them. Its drop counts explain the
 *   empty table, and four empty parts at the top would push the useful tables below the fold. A
 *   slot bound through a context usually has only element props, because it takes its variants
 *   from the root.
 * @param anatomy - Parts, shapes and drop counts the reader resolved for the page.
 * @param page - Namespace of the page, from {@link namespaceOf}.
 * @returns Each part, with the parts that accept props first.
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
