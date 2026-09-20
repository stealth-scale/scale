/**
 * Draws the frame the label, the field and the list sit in, and runs the machine they share.
 *
 * @remarks
 *   The element is `div` and carries no role. The list inside it is the `listbox`, and a role on
 *   the frame around it would announce a second one that holds nothing.
 *   The collection is the caller's. It decides which rows exist and in what order, so a list that
 *   narrows as a person types hands a new collection rather than asking the machine to filter.
 *   The orientation reaches the machine and the recipe from one prop. The machine decides which
 *   arrows move the highlight and says so on the list, and the recipe draws the rows the way they
 *   move, so a list a reader moves through sideways is never drawn as a column.
 *   A boxed list leaves its picked rows unfilled unless a caller says otherwise. The box at the
 *   start of a row already says the row is in the set, and a fill behind it says the same thing a
 *   second time.
 *   The machine is told how to scroll to a row only while a window says how. Left alone it scrolls
 *   the highlighted row into view itself, which is right for every list that draws all its rows,
 *   and a function installed unconditionally would replace that with one that knows nothing.
 *   The window's function is held behind one of its own. A state setter handed a function calls it
 *   to work out the next state rather than storing it, so the window's way of scrolling was called
 *   once with the state before it and never again.
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
 * Draws the frame and sets the variants every part below it reads.
 */
const Framed = withProvider("div", "root");

/**
 * Describes what the root takes beyond the machine's options and the element's props.
 */
export interface RowShape {
  /**
   * Whether a box at the start of every row says the set may hold several.
   */
  readonly boxed?: boolean | undefined;

  /**
   * The mark a chosen row draws, in its box or at its end.
   */
  readonly mark?: ReactNode | undefined;

  /**
   * The mark a box draws while part of the list is on rather than all of it.
   */
  readonly mixedMark?: ReactNode | undefined;
}

/**
 * Describes what the root takes: the machine's options, the recipe's variants, and the element's.
 *
 * @remarks
 *   Every prop the machine owns is taken off the element's, so the two never offer one name under
 *   two types.
 */
export interface RootProps
  extends
    ListboxOptions,
    Omit<ComponentProps<typeof Framed>, keyof ListboxOptions | keyof RowShape>,
    RowShape {}

/**
 * Offers a set of rows a person picks from.
 *
 * @param props - The machine's options, the recipe's variants and the element's props together.
 * @returns The frame, holding the parts, under the running machine.
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
