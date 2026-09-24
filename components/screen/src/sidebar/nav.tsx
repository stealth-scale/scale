/**
 * Renders one block of destinations under a label.
 *
 * @remarks
 *   The element is `nav`, and its `aria-labelledby` points at the block's `NavLabel`, so a screen
 *   reader lists the landmark as `Workspace` or `Account`. A block without a label takes
 *   `aria-label`, and a caller's `aria-label` replaces the label's name. The identifier comes from
 *   `useId` in the block and reaches the label through context, so the name is present on the
 *   first render.
 */

import { type ComponentProps, type ReactElement, useId, useMemo } from "react";

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

  return (
    <NavProvider value={state}>
      <Blocked
        aria-labelledby={props["aria-label"] === undefined ? labelId : undefined}
        {...props}
      />
    </NavProvider>
  );
}
