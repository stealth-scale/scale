/**
 * Names one drawing of a component that states a landmark of its own.
 *
 * @remarks
 *   A page draws its component once for every value of every axis, and a component whose root is a
 *   `nav`, an `aside` or a named `section` brings a landmark with it each time. A dozen landmarks
 *   under one name are a dozen entries a reader moving by landmark cannot tell apart, which is what
 *   `landmark-unique` reports. The values the cell was drawn with are what tells the drawings
 *   apart, so they are what the name says. Hand it the props the scene handed the drawing and
 *   nothing else. Anything a page states for every cell alike names no cell in particular and only
 *   makes the reading longer.
 *   Reach for this where the page states the name, as a breadcrumb and a table take theirs. Where
 *   the component reads its name off what it draws, as a section reads its title and a sidebar's
 *   block reads its heading, the page cannot vary the name without changing the drawing, so draw
 *   the root as a `div` with `as` instead and the drawing brings no landmark at all. A shell is
 *   the same case for a different reason: a document holds one `main`, so a page drawing eight
 *   shells cannot draw eight of them whatever they are called.
 */

/**
 * Writes one axis and the value the cell was drawn at.
 */
function said([axis, value]: readonly [string, unknown]): string {
  return `${axis} ${String(value)}`;
}

/**
 * Returns the name one drawing states, which is the label and the values it was drawn at.
 *
 * @param label - The name every drawing on the page shares, such as `Breadcrumb`.
 * @param drawn - The axis values this drawing was handed.
 * @returns The label on its own where the drawing was handed none, and the label with the values
 *   after it otherwise.
 */
export function landmarked(label: string, drawn: Readonly<Record<string, unknown>>): string {
  const values = Object.entries(drawn).filter(([, value]) => value !== undefined);

  return values.length === 0 ? label : `${label}: ${values.map((one) => said(one)).join(", ")}`;
}
