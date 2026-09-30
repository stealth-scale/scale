/**
 * Renders one block of destinations under a label, with a scope a search in the block filters.
 *
 * @remarks
 *   The element is `nav`, and its `aria-labelledby` points at the block's `NavLabel`, so a screen
 *   reader lists the landmark as `Workspace` or `Account`. A block without a label takes
 *   `aria-label`, and a caller's `aria-label` replaces the label's name. The block creates the
 *   identifier with `useId` and provides it to the label through context, so the name is present on
 *   the first render. The block's scope is inside the sidebar's, so a search in the header filters
 *   the block's rows and a search in the block filters them alone. While a query matches none of
 *   the block's rows, the block writes `data-unmatched`, and the recipe hides a block that renders
 *   no empty message, its label included.
 */

import {
  type ComponentProps,
  type ReactElement,
  useId,
  useMemo,
  useSyncExternalStore,
} from "react";

import { FilterContext, useFilterScope } from "@stealthscale/hooks";

import { withContext } from "#sidebar/context.ts";
import { NavProvider } from "#sidebar/state.ts";

/**
 * Renders the block `nav` at the sidebar's size.
 */
const Blocked = withContext("nav", "nav");

/**
 * Describes the props of `Nav`, less the `aria-labelledby` the block sets.
 */
export type NavProps = Omit<ComponentProps<typeof Blocked>, "aria-labelledby">;

/**
 * Renders a block of destinations named by its label or by `aria-label`.
 *
 * @param props - The `nav` element's props, less `aria-labelledby`.
 * @returns The block, with `aria-labelledby` unless `aria-label` is passed.
 */
export function Nav(props: NavProps): ReactElement {
  const labelId = useId();
  const state = useMemo(() => ({ labelId }), [labelId]);
  const scope = useFilterScope();
  const unmatched = useSyncExternalStore(
    scope.subscribe,
    () => scope.active() && scope.listed() > 0 && scope.matched() === 0,
    () => false,
  );

  return (
    <NavProvider value={state}>
      <FilterContext value={scope}>
        <Blocked
          aria-labelledby={props["aria-label"] === undefined ? labelId : undefined}
          {...props}
          data-unmatched={unmatched ? "" : undefined}
        />
      </FilterContext>
    </NavProvider>
  );
}
