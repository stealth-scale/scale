/**
 * Derives every message identifier a form reads from the form's own identifier and a path.
 */

import { collapse } from "#path.ts";

/**
 * Describes the identifiers one form reads, each derived from its identifier and a path or a name.
 */
export interface Identifiers {
  /**
   * Derives the identifier of an action the form offers: `submit`, `next`, `back`, `add` or
   * `remove`.
   */
  readonly action: (name: string) => string;

  /**
   * Derives the identifier of a field's help text.
   */
  readonly description: (path: string) => string;

  /**
   * Derives the identifiers of a failure from a schema keyword: the form's own, then the one the
   * whole product shares.
   */
  readonly error: (path: string, keyword: string) => readonly [own: string, shared: string];

  /**
   * Derives the identifier of a field's label.
   */
  readonly label: (path: string) => string;

  /**
   * Derives the identifier of a group's legend.
   */
  readonly legend: (name: string) => string;

  /**
   * Derives the identifiers of a mark beside a field's label, such as `optional`: the form's own,
   * then the one the whole product shares.
   */
  readonly mark: (name: string) => readonly [own: string, shared: string];

  /**
   * Derives the identifier of one choice of an enum.
   */
  readonly option: (path: string, value: string) => string;

  /**
   * Derives the identifier of the words under one choice of an enum, which a card shows below the
   * choice's own words.
   */
  readonly optionDescription: (path: string, value: string) => string;

  /**
   * Derives the identifier of a field's placeholder.
   */
  readonly placeholder: (path: string) => string;

  /**
   * Derives the identifier of a step's label.
   */
  readonly step: (name: string) => string;
}

/**
 * Derives the identifiers a form reads from its identifier.
 *
 * @remarks
 *   Every index in a path is collapsed, so one identifier covers every row of a repeat group. A
 *   form with `id: "checkout"` and a field at `billing.vat` reads
 *   `checkout.fields.billing.vat.label` with no configuration. An error at the root of the
 *   schema, whose path is empty, reads `checkout.errors.<keyword>`.
 * @param id - The identifier every identifier of the form begins with.
 */
export function identifiers(id: string): Identifiers {
  /**
   * Prefixes one derived identifier with the form's, leaving an empty path out.
   */
  const of = (kind: string, path: string, leaf: string): string =>
    path === "" ? `${id}.${kind}.${leaf}` : `${id}.${kind}.${collapse(path)}.${leaf}`;

  return {
    action: (name) => `${id}.actions.${name}`,
    description: (path) => of("fields", path, "description"),
    error: (path, keyword) => [of("errors", path, keyword), `errors.${keyword}`],
    label: (path) => of("fields", path, "label"),
    legend: (name) => of("groups", name, "legend"),
    mark: (name) => [`${id}.marks.${name}`, `marks.${name}`],
    option: (path, value) => of("fields", path, `options.${value}`),
    optionDescription: (path, value) => of("fields", path, `descriptions.${value}`),
    placeholder: (path) => of("fields", path, "placeholder"),
    step: (name) => of("steps", name, "label"),
  };
}
