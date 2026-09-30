/**
 * Renders the list that contains the rows, and moves focus between rows with the arrow keys.
 *
 * @remarks
 *   The element is `ul`, so a screen reader announces the number of items. The list sets no
 *   landmark, because a page renders several lists and the landmark belongs to whatever names the
 *   set: a sidebar's `nav`, or a `nav` the caller renders around the list. Do not pass `as="nav"`.
 *   The rows are `li` elements, and a `nav` holding them directly is not read as a list. The list
 *   handles the arrow keys on its own axis: down and up for `list`, left and right for `dock`. A
 *   caller's own key handler runs first, and a key it prevents is not handled. `iconic` and `size`
 *   default to the nearest `NavList.PropsProvider`, and the list tells its rows whether it is
 *   iconic.
 */

import { type ComponentProps, type ReactElement, useMemo } from "react";

import { mergeProps } from "@zag-js/react";

import { omitUndefined } from "@stealthscale/hooks";

import { withProvider } from "#nav-list/context.ts";
import { useRowKeys } from "#nav-list/keys.ts";
import { ListProvider, useDefaults } from "#nav-list/state.ts";

/**
 * Renders the list `ul` and provides the variants to every part below it.
 */
const Listed = withProvider("ul", "root");

/**
 * The variant whose rows run along the inline axis.
 */
const DOCK = "dock";

/**
 * Describes the props of `Root`.
 */
export type RootProps = ComponentProps<typeof Listed>;

/**
 * Renders the list and handles the arrow keys that move focus between rows.
 *
 * @param props - The recipe's variants and the `ul` element's props.
 * @returns The list.
 */
export function Root({ iconic, size, ...rest }: RootProps): ReactElement {
  const defaults = useDefaults();
  const drawn = iconic ?? defaults.iconic ?? false;
  const onKeyDown = useRowKeys(rest.variant === DOCK);
  const state = useMemo(() => ({ iconic: drawn }), [drawn]);

  return (
    <ListProvider value={state}>
      <Listed
        {...mergeProps({ onKeyDown }, rest)}
        {...omitUndefined({ size: size ?? defaults.size })}
        iconic={drawn}
      />
    </ListProvider>
  );
}
