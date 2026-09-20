/**
 * Writes and reads the address of one sample: the page, the scene on it, and which of the scene's
 * samples, in the fragment of a URL a frame loads the catalogue at.
 *
 * @remarks
 *   The fragment rather than the path or the query, because the frame's document is the
 *   application itself, routed to its framed page, and nothing in the address is the router's
 *   business. A scene is named by its position on the page rather than by its title, because a
 *   title is a word that follows the language, and a sample by its position on each axis rather
 *   than by its caption, for the same reason.
 */

/**
 * Selects one sample of a scene: a cell of a matrix by its position on each axis, or a sample of
 * a board by its position. Nothing selects the whole scene.
 */
export interface Pick {
  /**
   * The position along the axis that crosses, for a cell of a crossed matrix.
   */
  readonly across?: number | undefined;

  /**
   * The position of a sample on a board.
   */
  readonly sample?: number | undefined;

  /**
   * The position along the axis, for a cell of a matrix.
   */
  readonly value?: number | undefined;
}

/**
 * Locates one sample of one scene of one page.
 */
export interface Address {
  /**
   * The page's identifier.
   */
  readonly page: string;

  /**
   * Which sample of the scene.
   */
  readonly pick: Pick;

  /**
   * The position of the scene on the page.
   */
  readonly scene: number;
}

/**
 * The name each part of a pick is written under.
 */
const KEYS: Readonly<Record<keyof Pick, string>> = { across: "x", sample: "s", value: "v" };

/**
 * Reads a whole number written in the address, or nothing for anything else.
 */
function numbered(written: null | string): number | undefined {
  if (written === null || !/^\d+$/u.test(written)) return undefined;

  return Number(written);
}

/**
 * Writes the fragment a frame loads a sample at.
 *
 * @param address - The page, the scene and the sample.
 * @returns The fragment, with its leading hash.
 */
export function writeAddress(address: Address): string {
  const query = new URLSearchParams();

  for (const part of ["value", "across", "sample"] as const) {
    const position = address.pick[part];

    if (position !== undefined) query.set(KEYS[part], String(position));
  }

  const written = query.toString();

  return `#${address.page}/${String(address.scene)}${written === "" ? "" : `?${written}`}`;
}

/**
 * Reads the sample a fragment addresses, or nothing where it addresses none.
 *
 * @param fragment - The fragment, with or without its leading hash.
 * @returns The address, or undefined for a fragment that names no page and scene.
 */
export function readAddress(fragment: string): Address | undefined {
  const [path = "", written = ""] = fragment.replace(/^#/u, "").split("?");
  const segments = path.split("/");
  const scene = numbered(String(segments.pop()));
  const page = segments.join("/");

  if (scene === undefined || page === "") return undefined;

  const query = new URLSearchParams(written);
  const pick: Pick = {};

  for (const part of ["value", "across", "sample"] as const) {
    const position = numbered(query.get(KEYS[part]));

    if (position !== undefined) Object.assign(pick, { [part]: position });
  }

  return { page, pick, scene };
}
