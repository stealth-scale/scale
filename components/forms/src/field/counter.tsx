/**
 * Renders the length of the field's value against its limit.
 *
 * @remarks
 *   The element is a `p` that renders `12 / 200`: the length of the control's value in UTF-16
 *   code units, then the root's `maxLength`. Without a `maxLength` it renders the length alone.
 *   Children replace the text, for a caller that counts another way, such as graphemes. The
 *   counter is part of the control's `aria-describedby`, so assistive technology reads it with the
 *   control. It sets no `aria-live`, because a live region would announce every keystroke.
 */

import { type ComponentProps, type ReactElement, useSyncExternalStore } from "react";

import { withContext } from "#field/context.ts";
import { useField } from "#field/state.ts";

/**
 * Renders the counter `p` with the field's counter class.
 */
const Counted = withContext("p", "counter");

/**
 * Describes the props of the counter: the props of a `p`.
 */
export type CounterProps = ComponentProps<typeof Counted>;

/**
 * Renders the length of the value, against the limit where the field sets one.
 *
 * @param props - Attributes of the `p` element. Children replace the count.
 * @returns The `p` element holding the count.
 */
export function Counter({ children, ...props }: CounterProps): ReactElement {
  const { ids, maxLength, tally } = useField();
  const length = useSyncExternalStore(tally.subscribe, tally.get, tally.get);
  const count =
    maxLength === undefined ? String(length) : `${String(length)} / ${String(maxLength)}`;

  return (
    <Counted id={ids.counter} {...props}>
      {children ?? count}
    </Counted>
  );
}
