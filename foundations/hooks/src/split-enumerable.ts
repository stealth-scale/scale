/**
 * Wraps a splitter of props so it reads a props object's own enumerable properties and nothing
 * else.
 */

/**
 * Splits a props object into the properties a machine reads and the rest.
 *
 * @typeParam Props - What the component takes.
 * @typeParam Picked - The properties the machine reads.
 * @typeParam Rest - The properties left for the element.
 */
export type Splitter<Props, Picked, Rest> = (props: Props) => [Picked, Rest];

/**
 * Returns a splitter that hands the one it wraps a copy of the props holding their own enumerable
 * properties only.
 *
 * @remarks
 *   A state machine's splitter reads every own key of the object it is handed, the
 *   non-enumerable ones included. In development React defines a non-enumerable `key` on the
 *   props of an element created with one, whose getter warns that `key` is not a prop, and a
 *   splitter reading it both raises the warning and copies `key` into the rest, which then warns
 *   again when the rest is spread onto an element. A spread copies own enumerable properties
 *   only, so the splitter never meets the getter.
 * @param split - The machine's own splitter.
 * @returns The same split, over a copy of the props.
 */
export function splitEnumerable<Props extends object, Picked, Rest>(
  split: Splitter<Props, Picked, Rest>,
): Splitter<Props, Picked, Rest> {
  return (props) => split({ ...props });
}
