/**
 * Renders the listbox's root and runs the machine its parts share.
 *
 * @remarks
 *   The element is a `div` with no role. The content is the `listbox`. The collection is the
 *   caller's: a list that filters as a person types passes a new collection, and the machine never
 *   filters. `orientation` reaches the machine and the recipe from one prop, so the arrow keys
 *   follow the layout. A boxed list defaults `selected` to `none`, because the checkbox already
 *   shows the selection. The root passes `scrollToIndexFn` to the machine only while a window
 *   provides one. Without it the machine scrolls the highlighted row into view itself. The root
 *   stores the window's function inside an updater, because a state setter calls a function it is
 *   given to compute the next state.
 */

import {
  type ComponentProps,
  type ReactElement,
  type ReactNode,
  useId,
  useMemo,
  useState,
} from "react";

import { withProvider } from "#listbox/context.ts";
import {
  ApiProvider,
  type ListboxOptions,
  splitListboxProps,
  useListboxMachine,
} from "#listbox/machine.ts";
import { type Shown, ShownProvider } from "#listbox/shown.ts";
import { scrolledBy, type Windowed, WindowedProvider } from "#listbox/windowed.ts";

/**
 * Renders the root `div` with the recipe's variants.
 */
const Framed = withProvider("div", "root");

/**
 * Describes the props that set how every row renders its selection.
 */
export interface RowShape {
  /**
   * Whether every row renders a checkbox at its start.
   */
  readonly boxed?: boolean | undefined;

  /**
   * Mark a selected row renders, in its checkbox or at its end.
   */
  readonly mark?: ReactNode | undefined;

  /**
   * Mark the select-all checkbox renders while part of the list is selected.
   */
  readonly mixedMark?: ReactNode | undefined;
}

/**
 * Describes the props of the root: the machine's options, the recipe's variants, `RowShape` and
 * the props of a `div`.
 *
 * @remarks
 *   The element's props of the same names as the machine's options are left out, so no prop has
 *   two types.
 */
export interface RootProps
  extends
    ListboxOptions,
    Omit<ComponentProps<typeof Framed>, keyof ListboxOptions | keyof RowShape>,
    RowShape {}

/**
 * Renders the listbox and provides the machine's api, `boxed`, the marks and the window slot to
 * its parts.
 *
 * @param props - The machine's options, the recipe's variants, `boxed`, the marks and the props of
 *   a `div`.
 * @returns The root `div`.
 */
export function Root({
  boxed = false,
  id,
  mark,
  mixedMark,
  scrollToIndexFn,
  selected,
  ...props
}: RootProps): ReactElement {
  const generated = useId();
  const [scroll, setScroll] = useState<((index: number) => void) | null>(null);

  const scrolling = useMemo(
    () => scrollToIndexFn ?? (scroll === null ? undefined : scrolledBy(scroll)),
    [scroll, scrollToIndexFn],
  );
  const [options, rest] = splitListboxProps({
    ...props,
    id: id ?? generated,
    ...(scrolling === undefined ? {} : { scrollToIndexFn: scrolling }),
  });
  const api = useListboxMachine(options);
  const { orientation } = options;
  const shown = useMemo<Shown>(() => ({ boxed, mark, mixedMark }), [boxed, mark, mixedMark]);
  const windowed = useMemo<Windowed>(
    () => ({
      hold: (next): void => {
        setScroll(() => next);
      },
    }),
    [setScroll],
  );
  const filled = selected ?? (boxed ? ("none" as const) : undefined);

  return (
    <ApiProvider value={api}>
      <ShownProvider value={shown}>
        <WindowedProvider value={windowed}>
          <Framed
            {...rest}
            {...(filled === undefined ? {} : { selected: filled })}
            {...(orientation === undefined ? {} : { orientation })}
            {...api.getRootProps()}
          />
        </WindowedProvider>
      </ShownProvider>
    </ApiProvider>
  );
}
